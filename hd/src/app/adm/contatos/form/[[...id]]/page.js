"use client";

import PaginaAdm from "@/app/components/PaginaAdm";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Col, Form, Row, Alert, InputGroup } from "react-bootstrap";
import { FaCheck, FaAddressBook, FaEnvelope } from "react-icons/fa"; 
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";
import { useState } from "react";
import ContatoValidator from "@/validators/ContatoValidator";
import { mask } from "remask";

export default function Page({ params }) {
  const route = useRouter();

  const contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  const dados = contatos.find((item) => item.id == params.id);

  const contato = dados || { nome: "",telefone: "", detalhes: "" };
  const [successMessage, setSuccessMessage] = useState("");

  function salvar(values, { resetForm }) {
    if (contato.id) {
      const i = contatos.findIndex(item => item.id === contato.id);
      contatos.splice(i, 1, values);
    } else {
      values.id = v4();
      contatos.push(values);
    }

    localStorage.setItem("contatos", JSON.stringify(contatos));
    route.push("/adm/contatos");
    setSuccessMessage("Contato salvo com sucesso!");
    resetForm(); 
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000); 
  }

  return (
    <PaginaAdm titulo="Contato">
      {successMessage && <Alert variant="success" style={{ textAlign: "center" }}>{successMessage}</Alert>}

      <Formik initialValues={contato} 
      validationSchema={ContatoValidator}
      onSubmit={(values, actions) => salvar(values, actions)}>
        {({ 
            values, 
            handleChange, 
            handleSubmit,
            setFieldValue,
            errors
                    }) => (
          <Form onSubmit={handleSubmit} style={{
            margin: "20px auto",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "600px"
          }}>
            <Row>
            <div
                  className="my-4"
                  style={{ textAlign: "center", marginBottom: "20px" }}
                >
                  <h2>{params.id ? "Editar Contato" : "Novo Contato"}</h2>
                  <FaAddressBook size={60} color="#007bff" />
                </div>
              <Col xs={12}>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={values.nome}
                    onChange={handleChange("nome")}
                    required
                    placeholder="Digite o nome do contato"
                    isInvalid={errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>  
                </Form.Group>
              </Col>
              <Col xs={12}>
              <Form.Group className="mb-3" controlId="telefone">
                      <Form.Label>Telefone:</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefone"
                        value={values.telefone}
                        onChange={(value) => {
                          setFieldValue(
                            "telefone",
                            mask(value.target.value, "(99) 99999-9999")
                          );
                        }}
                        isInvalid={values.telefone}
                        required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.telefone}
                        </Form.Control.Feedback>  
                    </Form.Group>

              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3" controlId="detalhes">
                  <Form.Label>Mensagem</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="mensagem"
                    value={values.mensagem}
                    onChange={handleChange("mensagem")}
                    required
                    placeholder="Digite os detalhes do contato"
                    isInvalid={values.mensagem}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mensagem}
                  </Form.Control.Feedback>  
                </Form.Group>
              </Col>
              <div className="text-center">
              <Button onClick={handleSubmit} variant="success" className="ms-2">
                <FaCheck /> Salvar
              </Button>
                <Link href="/adm/contatos" className="btn btn-danger ms-2">
                  <MdOutlineArrowBack /> Voltar
                </Link>
              </div>
            </Row>
          </Form>
        )}
      </Formik>
    </PaginaAdm>
  );
}
