'use client';

import Pagina from "@/app/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link"; 

export default function Page() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const produtosLocalStorage = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(produtosLocalStorage);
  }, []);

  const adicionarAListaDeCompras = (produto) => {
    const listaCompras = JSON.parse(localStorage.getItem("listaCompras")) || [];
    const jaExiste = listaCompras.find((item) => item.id === produto.id);

    if (!jaExiste) {
      listaCompras.push({ ...produto, quantidade: 1 });
    } else {
      jaExiste.quantidade++;
    }

    localStorage.setItem("listaCompras", JSON.stringify(listaCompras));
  };

  return (
    <Pagina titulo="Produtos">
     <Container>
     <Row>
        {produtos.map((produto) => (
          <Col xs={12} md={3} key={produto.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={produto.imagemUrl}
                alt={produto.nome}
                style={{ maxHeight: "200px", objectFit: "cover", padding: "10px" }} 
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="text-center">{produto.nome}</Card.Title>
                  <Card.Text>
                    <Row>
                      <Col xs={6}>
                        <small><strong>Descrição:</strong> {produto.descricao}</small>
                      </Col>
                      <Col xs={6}>
                        <small><strong>Quantidade:</strong> {produto.quantidade}</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <small><strong>Medida:</strong> {produto.medida}</small>
                      </Col>
                      <Col xs={6}>
                        <small><strong>Peso:</strong> {produto.peso}</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <small><strong>Valor Unitário:</strong> R${produto.valorUnitario}</small>
                      </Col>
                    </Row>
                  </Card.Text>
                </div>
                <div className="d-flex justify-content-center">
                  <Link
                    href="/pedidosClientes"
                    className="btn btn-primary w-100 my-2"
                    onClick={() => adicionarAListaDeCompras(produto)}
                  >
                    <span>Comprar</span>
                    <FaShoppingCart size={24} style={{ marginLeft: '10px' }} />
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
     </Container>
    </Pagina>
  );
}
