"use client";

import PaginaAdm from "@/app/components/PaginaAdm";
import PedidoValidator from "@/validators/PedidosValidator";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheck, FaDownload, FaShoppingCart } from "react-icons/fa";
import { MdDelete, MdOutlineArrowBack } from "react-icons/md";
import { v4 } from "uuid";

export default function Page({ params }) {
  const route = useRouter();

 
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const dados = pedidos.find((item) => item.id == params.id);

  const pedido = dados || {
    id: "",
    dataPedido: "",
    previsaoEntrega: "",
    produtos: [],
    nomeCliente: "",
    valorTotal: 0,
    status: "Aguardando Pagamento",
    imagemProduto: []
  };

  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [imagemProduto, setImagemProduto] = useState(pedido.imagemProduto || []);

  useEffect(() => {
    setClientes(JSON.parse(localStorage.getItem("clientes")) || []);
    setProdutos(JSON.parse(localStorage.getItem("produtos")) || []);
  }, []);

  const downloadImagem = (imagem, index) => {
    const link = document.createElement("a");
    link.href = imagem;
    link.download = `pedido_${pedido.id}_produto_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagensValidas = [];

    files.forEach((file) => {
      const fileType = file.type;

      if (fileType === "image/png" || fileType === "application/pdf") {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagensValidas.push(reader.result);
          if (imagensValidas.length === files.length) {
            setImagemProduto((prev) => [...prev, ...imagensValidas]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          title: "Formato de arquivo inválido!",
          text: "Por favor, envie apenas arquivos PNG ou PDF.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    });
  };

  const calcularValorTotal = (produtos) => {
    return produtos.reduce((total, produto) => {
      return total + produto.quantidade * produto.valorUnitario;
    }, 0);
  };

  function salvar(dados) {
    dados.valorTotal = calcularValorTotal(dados.produtos);
    dados.imagemProduto = imagemProduto; 
    

    if (pedido.id) {
      const index = pedidos.findIndex((p) => p.id === pedido.id);
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], ...dados }; 
    }
      //Object.assign(pedido, dados);
    } else {
      dados.id = v4();
      pedidos.push(dados);
    }
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    route.push("/adm/pedidos");
  }

  return (
    <PaginaAdm titulo="Pedidos">
      <Formik
        initialValues={{
          dataPedido: pedido.dataPedido,
          previsaoEntrega: pedido.previsaoEntrega,
          produtos: pedido.produtos,
          nomeCliente: pedido.nomeCliente,
          valorTotal: pedido.valorTotal || 0,
          status: pedido.status,
        }}
       validationSchema={PedidoValidator}
        onSubmit={(values) => {
          salvar(values);
        }}
      >
        {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
          console.log(errors)
          const addProduto = () => {
            setFieldValue("produtos", [
              ...values.produtos,
              { id: v4(), nome: "", quantidade: 1, valorUnitario: 0 },
            ]);
          };

          const delProduto = (id) => {
            const atuProdutos = values.produtos.filter(
              (prod) => prod.id !== id
            );
            setFieldValue("produtos", atuProdutos);
            setFieldValue("valorTotal", calcularValorTotal(atuProdutos));
          };

          const atuProdutos = (index, field, value) => {
            const atuProdutos = [...values.produtos];
            atuProdutos[index][field] = value;

            atuProdutos[index].valorTotal =
              atuProdutos[index].quantidade * atuProdutos[index].valorUnitario;

            setFieldValue("produtos", atuProdutos);
            setFieldValue("valorTotal", calcularValorTotal(atuProdutos));
          };

          const handleProductChange = (index, productName) => {
            const selecionarProduto = produtos.find(
              (product) => product.nome === productName
            );
            if (selecionarProduto) {
              atuProdutos(
                index,
                "valorUnitario",
                selecionarProduto.valorUnitario
              );
            }
            atuProdutos(index, "nome", productName);
          };

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
              <Row className="mb-3">
                <div
                  className="my-4"
                  style={{ textAlign: "center", marginBottom: "20px" }}
                >
                  <h2>{pedido.id ? "Editar Pedido" : "Novo Pedido"}</h2>
                  <FaShoppingCart size={60} color="#007bff" />
                </div>
                <Col xs={12} md={6}>
                  <Form.Group controlId="dataPedido">
                    <Form.Label>Data do Pedido</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataPedido"
                      value={values.dataPedido.split("T")[0]}
                      onChange={handleChange}
                      isInvalid={errors.dataPedido}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataPedido}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-4">
                  <Form.Label>Previsão de Entrega</Form.Label>
                  <Form.Control
                    type="date"
                    name="previsaoEntrega"
                    value={
                      typeof values.previsaoEntrega === "string"
                        ? values.previsaoEntrega.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    isInvalid={errors.previsaoEntrega}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <Form.Label className="me-2">Produtos</Form.Label>
                  {values.produtos.map((produto, index) => (
                    <Row key={produto.id} className="mb-3">
                      <Col xs={5}>
                        <Form.Select
                          name={`produtos[${index}].nome`}
                          value={produto.nome}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          {produtos.map((item) => (
                            <option key={item.id} value={item.nome}>
                              {item.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs={2}>
                        <Form.Control
                          type="number"
                          name={`produtos[${index}].quantidade`}
                          value={produto.quantidade}
                          onChange={(e) => {
                            atuProdutos(
                              index,
                              "quantidade",
                              Number(e.target.value)
                            );
                          }}
                          min="1"
                        />
                      </Col>
                      <Col xs={2}>
                        <Form.Control
                          type="number"
                          name={`produtos[${index}].valorUnitario`}
                          value={produto.valorUnitario}
                          readOnly
                        />
                      </Col>
                      <Col xs={1}>
                        <Button
                          variant="danger"
                          onClick={() => delProduto(produto.id)}
                        >
                          <MdDelete />
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button onClick={addProduto}>Adicionar Produto</Button>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="nomeCliente">
                    <Form.Label>Cliente</Form.Label>
                    {pedido.id ? (
                      <Form.Control
                        type="text"
                        name="nomeCliente"
                        value={pedido.nomeCliente}
                        readOnly
                      />
                    ) : (
                      <Form.Select
                        name="nomeCliente"
                        value={values.nomeCliente}
                        onChange={handleChange}
                        isInvalid={errors.nomeCliente}
                        required
                      >
                        <option value="">Selecione</option>
                        {clientes.map((item) => (
                          <option key={item.id} value={item.nomeCliente}>
                            {item.nome}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {errors.nomeCliente}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="valorTotal">
                    <Form.Label>Valor Total</Form.Label>
                    <Form.Control
                      type="number"
                      name="valorTotal"
                      value={values.valorTotal}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="status">
                    <Form.Label>Status do Pedido</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option value="Aguardando Pagamento">
                        Aguardando Pagamento
                      </option>
                      <option value="Pagamento Confirmado">
                        Pagamento Confirmado
                      </option>
                      <option value="Em Produção">Em Produção</option>
                      <option value="Pronto para Retirada">
                        Pronto pra Retirada
                      </option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Row className="my-4">
                  <Col xs={12}>
                    <Form.Group controlId="imagemProduto">
                      <Form.Label>
                        <strong>Envie imagens para o seu produto:</strong>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/png, application/pdf"
                        multiple
                        onChange={handleImageChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <h3>Imagens do Pedido:</h3>
            {pedido.imagemProduto && pedido.imagemProduto.length > 0 ? (
              pedido.imagemProduto.map((imagem, index) => (
                <div key={index} className="mb-2">
                  <img
                    src={imagem}
                    alt={`Imagem do Pedido ${pedido.id} - Produto ${index + 1}`}
                    style={{ maxHeight: "50px", objectFit: "cover" }}
                  />
                  <Button 
                    variant="link" 
                    onClick={() => downloadImagem(imagem, index)} 
                    className="mt-2">
                    <FaDownload /> Baixar Imagem
                  </Button>
                </div>
              ))
            ) : (
              <p>Nenhuma imagem disponível para este pedido.</p>
            )}
              </Row>
              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="success">
                  <FaCheck /> Salvar
                </Button>
                <Link href="/adm/pedidos" className="btn btn-danger ms-2">
                  <MdOutlineArrowBack /> Voltar
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </PaginaAdm>
  );
}
