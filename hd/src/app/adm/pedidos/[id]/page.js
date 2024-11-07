'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Button, Form, Card, Container } from 'react-bootstrap';
import { FaSave, FaArrowLeft, FaDownload } from 'react-icons/fa';
import PaginaAdm from "@/app/components/PaginaAdm"

export default function Page(){
  const { id } = useParams();
  const route = useRouter();
  const [pedido, setPedido] = useState(null);
  const [status, setStatus] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  useEffect(() => {
    if (id) {
      const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      const pedidoEncontrado = pedidos.find(p => p.id === Number(id));
      console.log("Pedido Encontrado:", pedidoEncontrado);
      setPedido(pedidoEncontrado);
      if (pedidoEncontrado) {
        setStatus(pedidoEncontrado.status);
        setNomeCliente(pedidoEncontrado.nomeCliente);
        setValorTotal(pedidoEncontrado.valorTotal);
      }
    }
  }, [id]);

  const salvarPedido = () => {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const index = pedidos.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], status, nomeCliente, valorTotal };
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      Swal.fire({
        title: 'Pedido atualizado!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
  
      }).then(() => {
        route.push('/adm/pedidos');
      });
    }
  };

  const downloadImagem = (imagem, index) => {
    const link = document.createElement('a');
    link.href = imagem;
    link.download = `pedido_${pedido.id}_produto_${index + 1}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!pedido) return <div>Carregando...</div>;


  return(
    <PaginaAdm titulo="Pedido">
    <Container className="mt-4">
      <Card style={{
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <Card.Body>
          <h2>Editar Pedido #{pedido.id}</h2>
          <p><strong>Data do Pedido:</strong> {new Date(pedido.dataPedido).toLocaleDateString()}</p>
          <p><strong>Data de Retirada:</strong> {new Date(pedido.previsaoEntrega).toLocaleDateString()}</p>
          
          <Form>
            <Form.Group controlId="formNomeCliente" className="mb-3">
              <Form.Label>Nome do Cliente</Form.Label>
              <Form.Control
                type="text"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite o nome do cliente"
              />
            </Form.Group>

            <Form.Group controlId="formValorTotal" className="mb-3">
              <Form.Label>Valor Total</Form.Label>
              <Form.Control
                type="text"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                placeholder="Digite o valor total"
              />
            </Form.Group>

            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Status do Pedido</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                <option value="Pagamento Confirmado">Pagamento Confirmado</option>
                <option value="Pronto para Retirada">Pronto para Retirada</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>

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

            <div className="d-flex justify-content-center mt-4">
              <Button variant="success" onClick={salvarPedido} className="me-2">
                <FaSave className="me-1" /> Salvar Alterações
              </Button>
              <Button variant="danger" onClick={() => route.push('/adm/pedidos')}>
                <FaArrowLeft className="me-1" /> Voltar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </PaginaAdm>
  )
}
