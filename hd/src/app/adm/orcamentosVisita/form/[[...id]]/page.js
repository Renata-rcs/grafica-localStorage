"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Row } from "react-bootstrap";
import { FaBoxOpen, FaCheck } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";
import OrcamentoVisitaValidator from "@/validators/OrcamentosVisitaValidator";
import PaginaAdm from "@/app/components/PaginaAdm";
import { mask } from "remask";

export default function Page({ params }) {
  const route = useRouter();

  const orcamentosVisita =
    JSON.parse(localStorage.getItem("orcamentosVisita")) || [];
  const dados = orcamentosVisita.find((item) => item.id == params.id);

  const orcamentoVisita = dados || {
    nome: "",
    email: "",
    telefone: "",
    detalhes: "",
  };

  function salvar(dados) {
    if (orcamentoVisita.id) {
      Object.assign(orcamentoVisita, dados);
    } else {
      dados.id = v4();
      orcamentosVisita.push(dados);
    }
    localStorage.setItem("orcamentosVisita", JSON.stringify(orcamentosVisita));
    return route.push("/adm/orcamentosVisita");
  }

  return (
    <PaginaAdm titulo="Orçamentos Mediante a Visita">
      <Formik
        initialValues={orcamentoVisita}
        validationSchema={OrcamentoVisitaValidator}
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
                  <h2>{orcamentoVisita.id ? "Editar Orçamento" : "Novo Orçamento"}</h2>
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
                <Button onClick={handleSubmit} variant="success">
                  <FaCheck /> Salvar
                </Button>
                <Link href="/adm/orcamentosVisita" className="btn btn-danger ms-2">
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
