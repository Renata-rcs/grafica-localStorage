"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import LoginValidator from "@/validators/LoginValidator";
import Swal from "sweetalert2";

export default function LoginPage() {
  const route = useRouter();

  const [clientes, setClientes] = useState([]);
  const usuarioFixo = "admin@admin";
  const senhaFixa = "123456";

  useEffect(() => {
    const cliente = JSON.parse(localStorage.getItem("clientes")) || [];
    setClientes(cliente);
  }, []);

  const handleLogin = (values) => {
    if (values.email === usuarioFixo && values.senha === senhaFixa) {
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ email: usuarioFixo, nome: "Administrador" })
      );
      Swal.fire({
        title: `Bem-vindo, Administrador`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        route.push("/adm"); 
      });
      return;
    }

    // Verificação para clientes cadastrados
    const usuario = clientes.find(
      (cliente) =>
        cliente.email === values.email && cliente.senha === values.senha
    );

    if (usuario) {
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ email: usuario.email, nome: usuario.nome })
      );
      Swal.fire({
        title: `Bem-vindo, ${usuario.nome}`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        route.push("/");
      });
    } else {
      Swal.fire({
        title: "Credenciais inválidas.",
        icon: "error",
        confirmButtonText: "Tente novamente",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col
          md={4}
          className="bg-light d-flex flex-column justify-content-center align-items-center p-4"
          style={{ borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
        >
          <img src="/images/icone.png" alt="Logo" width="100px" />
          <h2 className="text-center my-4">Login</h2>
          <Formik
            initialValues={{ email: "", senha: "" }}
            validationSchema={LoginValidator}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleSubmit, values, errors }) => (
              <Form onSubmit={handleSubmit} className="w-100">
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="********"
                    name="senha"
                    value={values.senha}
                    onChange={handleChange}
                    isInvalid={errors.senha}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.senha}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="text-center">
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#001969", color: "white" }}
                  >
                    Entrar
                  </Button>
                  <Link
                    href="/"
                    className="btn ms-2"
                    style={{ backgroundColor: "#001969", color: "white" }}
                  >
                    Voltar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="btn w-100 my-3"
                    style={{ backgroundColor: "#001969", color: "white" }}
                  >
                    Cadastrar
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}
