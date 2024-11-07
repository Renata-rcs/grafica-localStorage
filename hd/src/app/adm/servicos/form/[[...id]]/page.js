"use client";

import PaginaAdm from "@/app/components/PaginaAdm";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaUser } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";
import ServicoValidator from "@/validators/ServicosValidator";


export default function Page({ params }) {
  const route = useRouter();
  const servicos = JSON.parse(localStorage.getItem("servicos")) || [];
  const dados = servicos.find((item) => item.id == params.id);

  const servico = dados || {
    nome: "",
    descricao: "",
    material: "",
    responsavel: "",
  };

  // Estado para armazenar a lista de funcionários
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    setFuncionarios(JSON.parse(localStorage.getItem("funcionarios")) || []);
  }, []);

  function salvar(dados) {
    if (servico.id) {
      Object.assign(servico, dados);
    } else {
      dados.id = v4(); 
      servicos.push(dados);
    }
    localStorage.setItem("servicos", JSON.stringify(servicos));
    route.push("/adm/servicos"); 
  }

  return (
    <PaginaAdm titulo="Serviço">
      <Formik 
          initialValues={servico}
          validationSchema={ServicoValidator}
          onSubmit={(values) => salvar(values)}>

        {({ 
            values, 
            handleChange, 
            handleSubmit,
            errors
          }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              margin: "20px auto",
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              maxWidth: "600px"
            }}
          >
            <Row className="mb-3">
            <div
                  className="my-4"
                  style={{ textAlign: "center", marginBottom: "20px" }}
                >
                  <h2>{servico.id ? "Editar Serviço" : "Novo Serviço"}</h2>
                  <FaUser size={60} color="#007bff" />
                </div>
              <Col xs={12} md={6}>
                <Form.Group controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={values.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    required
                    isInvalid={errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="descricao">
                  <Form.Label>Descricao</Form.Label>
                  <Form.Control
                    type="text"
                    name="descricao"
                    value={values.descricao}
                    onChange={handleChange}
                    placeholder="Descrição do serviço"
                    required
                    isInvalid={errors.descricao}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.descricao}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="material">
                  <Form.Label>Material</Form.Label>
                  <Form.Control
                    type="text"
                    name="material"
                    value={values.material}
                    onChange={handleChange}
                    placeholder="Digite o material usado neste tipo de serviço"
                    required
                    isInvalid={errors.material}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.material}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="responsavel">
                  <Form.Label>Responsável</Form.Label>
                  <Form.Select
                    name="responsavel"
                    value={values.responsavel}
                    onChange={handleChange}
                    required
                    isInvalid={errors.responsavel}
                  >
                    <option value="">Selecione um responsável</option>
                    {funcionarios.map((funcionario) => (
                      <option key={funcionario.id} value={funcionario.nome}>
                        {funcionario.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.responsavel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
                <Button onClick={handleSubmit} variant="success">
                  <FaCheck /> Salvar
                </Button>
              <Link href="/adm/servicos" className="btn btn-danger ms-2">
                <MdOutlineArrowBack /> Voltar
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </PaginaAdm>
  );
}
