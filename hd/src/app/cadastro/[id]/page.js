"use client";

import Pagina from "@/app/components/Pagina";
import apiLocalidade from "@/app/services/apiLocalidade";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import ClientesValidator from "@/validators/ClientesValidator";
import { mask } from "remask";
import apiViaCep from "@/app/services/apiViaCep";
import Swal from "sweetalert2";

export default function Page({ params }) {
  const route = useRouter();

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const dados = clientes.find((item) => item.id == params.id);

  const cliente = dados || {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    pais: "Brasil",
    uf: "",
    cidade: "",
    cep: "",
    logradouro: "",
    bairro: "",
    numero: "",
    complemento: "",
  };

  const [paises, setPaises] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [camposBrasil, setCamposBrasil] = useState(false);
  const [camposCep, setCamposCep] = useState(false);

  useEffect(() => {
    apiLocalidade.get("/paises").then((resultado) => {
      setPaises(resultado.data);
    });
    apiLocalidade.get("/estados?orderBy=nome").then((resultado) => {
      setUfs(resultado.data);
    });
  }, []);

  function salvar(dados) {
  
    if (cliente.id) {
      Object.assign(cliente, dados);
    } else {
      dados.id = uuidv4();
      clientes.push(dados);
    }
    localStorage.setItem("clientes", JSON.stringify(clientes));
    Swal.fire({
      title: "Dados atualizados com sucesso!",
      icon: "success",
      showConfirmButton: "OK",
      customClass: {
        confirmButton: 'btn btn-primary', 
      }
    }).then(() => {
      route.push("/");
    });
  }

  return (
    <Pagina titulo="Cliente">
      <Formik
        initialValues={cliente}
        validationSchema={ClientesValidator}
        onSubmit={(values) => salvar(values)}
      >
       {({ values, handleChange, handleSubmit, setFieldValue, errors }) => {
          useEffect(() => {
            setCamposBrasil(values.pais === "Brasil");
          }, [values.pais]);

          useEffect(() => {
            if (values.uf) {
              apiLocalidade
                .get(`/estados/${values.uf}/municipios`)
                .then((resultado) => {
                  setCidades(resultado.data);
                });
            }
          }, [values.uf]);
          useEffect(() => {
            if (values.cep) {
              const maskedCep = values.cep.replace("-", ""); 
              apiViaCep
                .get(`${maskedCep}/json`)
                .then((resultado) => {
                  if (values.cep) {
                    setFieldValue("logradouro", resultado.data.logradouro);
                    setFieldValue("bairro", resultado.data.bairro);
                    setCamposCep(resultado.data);
                  } else {
                    console.error("CEP não encontrado.");
                    setCamposCep(false);
                  }
                })
                .catch((error) => {
                  console.error("Erro ao buscar dados do CEP:", error);
                  setCamposCep(false);
                });
            } else {
              setCamposCep(false);
            }
          }, [values.cep]);
          
          return (
            <Form
              onSubmit={handleSubmit}
              style={{
                margin: "20px auto",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#f8f9fa",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                maxWidth: "600px",
              }}
            >
              <Row>
                <div
                  className="my-4"
                  style={{ textAlign: "center", marginBottom: "20px" }}
                >
                  <h2>{cliente.id ? "Editar Cliente" : "Novo Cliente"}</h2>
                  <FaUserCircle size={60} color="#007bff" />
                </div>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={values.nome}
                    onChange={handleChange}
                    isInvalid={errors.nome}
                    placeholder="Digite seu nome"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="cpf">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={values.cpf}
                    onChange={(value) =>
                      setFieldValue(
                        "cpf",
                        mask(value.target.value, "999.999.999-99")
                      )
                    }
                    isInvalid={errors.cpf}
                    placeholder="Digite seu CPF"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={values.telefone}
                    onChange={(value) =>
                      setFieldValue(
                        "telefone",
                        mask(value.target.value, "(99) 99999-9999")
                      )
                    }
                    isInvalid={errors.telefone}
                    placeholder="Digite seu telefone"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={errors.email}
                    placeholder="Digite seu email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="senha">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={values.senha}
                    onChange={handleChange}
                    isInvalid={errors.senha}
                    placeholder="Digite sua senha"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.senha}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="pais">
                  <Form.Label>País</Form.Label>
                  <Form.Select
                    name="pais"
                    value={values.pais}
                    onChange={handleChange}
                    isInvalid={errors.pais}
                  >
                    <option value="">Selecione</option>
                    {paises.map((item) => (
                      <option key={item.nome} value={item.nome}>
                        {item.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.pais}
                  </Form.Control.Feedback>
                </Form.Group>

                {camposBrasil && (
                  <>
                    <Row className="mb-3">
                      <Col>
                        <Form.Group controlId="uf">
                          <Form.Label>UF</Form.Label>
                          <Form.Select
                            name="uf"
                            value={values.uf}
                            onChange={handleChange}
                            isInvalid={errors.uf}
                          >
                            <option value="">Selecione</option>
                            {ufs.map((item) => (
                              <option key={item.sigla} value={item.sigla}>
                                {item.sigla} - {item.nome}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.uf}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId="cidade">
                          <Form.Label>Cidade</Form.Label>
                          <Form.Select
                            name="cidade"
                            value={values.cidade}
                            onChange={handleChange}
                            isInvalid={errors.cidade}
                          >
                            <option value="">Selecione</option>
                            {cidades.map((item) => (
                              <option key={item.nome} value={item.nome}>
                                {item.nome}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.cidade}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="cep">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      name="cep"
                      value={values.cep}
                      onChange={(value) => {
                        setFieldValue(
                          "cep",
                          mask(value.target.value, "99999-999")
                        );
                      }}
                      isInvalid={errors.cep}
                      placeholder="Digite seu CEP"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cep}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {camposCep && (
                      <>
                    <Form.Group className="mb-3" controlId="logradouro">
                      <Form.Label>Logradouro</Form.Label>
                      <Form.Control
                        type="text"
                        name="logradouro"
                        value={values.logradouro}
                        onChange={handleChange}
                        isInvalid={errors.logradouro}
                        placeholder="Digite seu logradouro"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.logradouro}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="bairro">
                      <Form.Label>Bairro</Form.Label>
                      <Form.Control
                        type="text"
                        name="bairro"
                        value={values.bairro}
                        onChange={handleChange}
                        isInvalid={errors.bairro}
                        placeholder="Digite seu bairro"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bairro}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="numero">
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        type="text"
                        name="numero"
                        value={values.numero}
                        onChange={handleChange}
                        isInvalid={errors.numero}
                        placeholder="Digite o número"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numero}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="complemento">
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        type="text"
                        name="complemento"
                        value={values.complemento}
                        onChange={handleChange}
                        isInvalid={errors.complemento}
                        placeholder="Digite o complemento"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.complemento}
                      </Form.Control.Feedback>
                    </Form.Group>
                      </>
                    )}
                   
                  </>
                )}

                <div className="text-center">
                  <Button type="submit" variant="success">
                    <FaCheck /> Salvar
                  </Button>
                  <Link href="/" className="btn btn-danger ms-2">
                    <MdOutlineArrowBack /> Voltar
                  </Link>
                </div>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </Pagina>
  );
}
