"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";
import PaginaAdm from "@/app/components/PaginaAdm";
import ProdutoValidator from "@/validators/ProdutosValidator";

export default function Page({ params }) {
  const route = useRouter();

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const dados = produtos.find((item) => item.id == params.id);

  const produto = dados || {
    id: "",
    nome: "",
    descricao: "",
    quantidade: "",
    medida: "",
    peso: "",
    servico: "",
    valorUnitario: "",
    imagemUrl: "",
  };

  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    console.log("Carregando lista de serviços...");
    setServicos(JSON.parse(localStorage.getItem("servicos")) || []);
  }, []);


  
    function salvar(dados) {
      const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
    
      if (dados.id) {
      
        const index = produtosSalvos.findIndex((item) => item.id === dados.id);
        if (index !== -1) {
          produtosSalvos[index] = dados;
        } else {
          produtosSalvos.push(dados);  
        }
      } else {
        dados.id = v4();
        produtosSalvos.push(dados);
      }
    

      localStorage.setItem("produtos", JSON.stringify(produtosSalvos));    
      route.push("/adm/produtos");
    }
    
  

  return (
    <PaginaAdm titulo="produto">
      <Formik
        initialValues={produto}
        validationSchema={ProdutoValidator}
        onSubmit={(values) => {
          console.log("Valores enviados:", values);
          salvar(values);
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
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
              <div className="my-4" style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2>{produto.id ? "Editar produto" : "Novo produto"}</h2>
                <FaUserCircle size={60} color="#007bff" />
              </div>
              <Col xs={12} md={6}>
                <Form.Group controlId="nome">
                  <Form.Label>Nome do Produto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={values.nome}
                    onChange={(e) => {
                      console.log("Alteração no campo nome:", e.target.value);
                      handleChange(e);
                    }}
                    placeholder="Digite o nome do produto"
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
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    name="descricao"
                    value={values.descricao}
                    onChange={handleChange}
                    placeholder="Digite uma descrição"
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
                <Form.Group controlId="quantidade">
                  <Form.Label>Quantidade</Form.Label>
                  <Form.Control
                    type="Number"
                    name="quantidade"
                    value={values.quantidade}
                    onChange={handleChange}
                    placeholder="Digite a quantidade"
                    required
                    isInvalid={errors.quantidade}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantidade}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="medida">
                  <Form.Label>Medida</Form.Label>
                  <Form.Control
                    type="text"
                    name="medida"
                    value={values.medida}
                    onChange={handleChange}
                    placeholder="Digite a medida"
                    required
                    isInvalid={errors.medida}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.medida}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="peso">
                  <Form.Label>Peso</Form.Label>
                  <Form.Control
                    type="text"
                    name="peso"
                    value={values.peso}
                    onChange={handleChange}
                    placeholder="Digite o peso"
                    required
                    isInvalid={errors.peso}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.peso}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="valorUnitario">
                  <Form.Label>Valor Unitário</Form.Label>
                  <Form.Control
                    type="number"
                    name="valorUnitario"
                    value={values.valorUnitario}
                    onChange={handleChange}
                    placeholder="Digite o valor unitário"
                    required
                    isInvalid={errors.valorUnitario}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.valorUnitario}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="servico">
                  <Form.Label>Serviço</Form.Label>
                  <Form.Select
                    name="servico"
                    value={values.servico}
                    onChange={(e) => {
                      console.log("Serviço selecionado:", e.target.value);
                      handleChange(e);
                    }}
                    required
                    isInvalid={errors.servico}
                  >
                    <option value="">Selecione um Serviço</option>
                    {servicos.map((servico) => (
                      <option key={servico.id} value={servico.nome}>
                        {servico.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.servico}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={12}>
                <Form.Group controlId="imagemUrl">
                  <Form.Label>URL da Imagem do Produto</Form.Label>
                  <Form.Control
                    type="text"
                    name="imagemUrl"
                    value={values.imagemUrl}
                    onChange={handleChange}
                    placeholder="Cole a URL da imagem aqui"
                    required
                    isInvalid={errors.imagemUrl}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imagemUrl}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="text-center mt-4">
                  <Button type="submit" variant="success">
                    <FaCheck /> Salvar
                  </Button>
                  <Link href="/adm/produtos" className="btn btn-danger ms-2">
                    <MdOutlineArrowBack /> Voltar
                  </Link>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </PaginaAdm>
  );
}
