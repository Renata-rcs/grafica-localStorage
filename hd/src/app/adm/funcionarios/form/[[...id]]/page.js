"use client";

import apiLocalidade from "@/app/services/apiLocalidade";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 as uuidv4, v4 } from "uuid";
import { mask } from "remask";
import PaginaAdm from "@/app/components/PaginaAdm";
import FuncionarioValidator from "@/validators/FuncionariosValidator";

export default function Page({ params }) {
  const route = useRouter();

  const funcionarios  = JSON.parse(localStorage.getItem("funcionarios")) || [];
  const dados = funcionarios .find((item) => item.id == params.id);

  const funcionario  = dados || {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    dataContratacao: "",
    cargo: "",
    salario: ""
  };


  function salvar(dados) {
   if (funcionario .id) {
      Object.assign(funcionario , dados);
    } else {
      dados.id = v4();
      funcionarios.push(dados);
    }
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    route.push("/adm/funcionarios ");
  }

  return (
    <PaginaAdm titulo="Funcionario">
      <Formik
        initialValues={funcionario }
        validationSchema={FuncionarioValidator}
        onSubmit={(values) => salvar(values)}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors }) => {

          return (
            <Form onSubmit={handleSubmit}
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
                  <h2>{funcionario .id? "Editar funcionario " : "Novo funcionario "}</h2>
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
                    setFieldValue("cpf", mask(value.target.value, "999.999.999-99"))
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
              <Form.Group controlId="dataContratacao">
                <Form.Label>Data de Contratação</Form.Label>
                <Form.Control
                  type="date"
                  name="dataContratacao"
                  value={values.dataContratacao}
                  onChange={handleChange}
                  required
                  isInvalid={errors.dataContratacao}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dataContratacao}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="cargo">
                <Form.Label>Cargo</Form.Label>
                <Form.Control
                  type="text"
                  name="cargo"
                  value={values.cargo}
                  onChange={handleChange}
                  placeholder="Digite o cargo"
                  required
                  isInvalid={errors.cargo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cargo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="salario">
                <Form.Label>Salário</Form.Label>
                <Form.Control
                  type="text"
                  name="salario"
                  value={values.salario}
                  onChange={(value) => {
                    const inputValue = value.target.value.replace(/\D/g, "");
                    const maskFormat = inputValue.length > 6 ? "R$ 99.999,00" : "R$ 9.999,99";
                    setFieldValue(
                      "salario",
                      mask(value.target.value, maskFormat)
                    );
                  }}
                  placeholder="Digite o salário"
                  required
                  isInvalid={errors.salario}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.salario}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="text-center mt-4">
              <Button type="submit" variant="success">
                  <FaCheck /> Salvar
                </Button>
                <Link href="/adm/funcionarios " className="btn btn-danger ms-2">
                  <MdOutlineArrowBack /> Voltar
                </Link>
              </div>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </PaginaAdm>
  );
}
