"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Row } from "react-bootstrap";
import { FaBoxOpen, FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";
import OrcamentoValidator from "@/validators/OrcamentoValidator";
import Pagina from "../components/Pagina";
import { mask } from "remask";
import Swal from "sweetalert2";

export default function Page({ params }) {
  const route = useRouter();

  const orcamentos = JSON.parse(localStorage.getItem("orcamentosVisita")) || [];
  const dados = orcamentos.find((item) => item.id == params.id);

  const orcamento = dados || {
    nome: "",
    email: "",
    telefone: "",
    detalhes: "",
  };

  function salvar(dados, resetForm) {
    if (orcamento.id) {
      Object.assign(orcamento, dados);
    } else {
      dados.id = v4();
      orcamentos.push(dados);
    }
    localStorage.setItem("orcamentosVisita", JSON.stringify(orcamentos));
    
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Orçamento enviado com sucesso!',
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      resetForm(); // Limpa o formulário após o envio
      route.push("/"); // Redireciona para a página inicial
    });
  }

  return (
    <Pagina titulo="Orçamento">
      <Formik
        initialValues={orcamento}
        validationSchema={OrcamentoValidator}
        onSubmit={(values, { resetForm }) => salvar(values, resetForm)}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors }) => {
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
                  <h2>Novo Orçamento</h2>
                  <FaBoxOpen size={60} color="#007bff" />
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

                <Form.Group className="mb-3" controlId="detalhes">
                  <Form.Label>Detalhes do Orçamento</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="detalhes"
                    value={values.detalhes}
                    onChange={handleChange("detalhes")}
                    placeholder="Digite os detalhes do orçamento"
                    required
                    isInvalid={errors.detalhes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.detalhes}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button type="submit" variant="success">
                    <FaCheck /> Salvar
                  </Button>
                  <Link href="/orcamentos" className="btn btn-danger ms-2">
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
