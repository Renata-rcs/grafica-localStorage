"use client";

import PaginaAdm from "@/app/components/PaginaAdm";
import Link from "next/link";
import { FaPlusCircle, FaArrowLeft, FaEdit } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../styles/form.css";

export default function Page() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    setPedidos(JSON.parse(localStorage.getItem("pedidos")) || []);
  }, []);

  function excluir(id) {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Não, cancelar!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const dados = pedidos.filter((item) => item.id !== id);
        localStorage.setItem("pedidos", JSON.stringify(dados));
        setPedidos(dados);
        Swal.fire({
          title: "Excluído!",
          text: "Registro foi excluído.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    });
  }

  return (
    <PaginaAdm titulo="Pedidos">
       {/* <Link href="/adm/pedidos/form" className="btn text-white mb-3" style={{backgroundColor: '#001969'}}>
        <FaPlusCircle /> Novo 
      </Link> */}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Arte</th>
            <th>Data Pedido</th>
            <th>Previsão Entrega</th>
            <th>Produto</th>
            <th>Descrição do Produto</th>
            <th>Quantidade</th>
            <th>Cliente</th>
            <th>Valor Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/adm/pedidos/${item.id}`}>
                  <FaEdit className="text-primary" />
                </Link>
                <MdDelete
                  title="Excluir"
                  className="text-danger"
                  onClick={() => excluir(item.id)}
                />
              </td>
              <td>
             {Array.isArray(item.imagemProduto) && item.imagemProduto.length > 0 ? (
                   item.imagemProduto.length 
                 ) : (
                   <span>0</span> 
                 )}
               </td>
              <td>{new Date(item.dataPedido).toLocaleDateString()}</td>
              <td>{new Date(item.previsaoEntrega).toLocaleDateString()}</td>
              <td>
                {item.produtos.map((produto) => (
                  <div key={produto.id}>{produto.nome}</div>
                ))}
              </td>
              <td>
                {item.produtos.map((produto) => (
                  <div key={produto.id}>{produto.descricao}</div>
                ))}
              </td>
              <td>{item.produtos.reduce((total, produto) => total + produto.quantidade, 0)}</td>
              <td>{item.nomeCliente}</td>
              <td>R$ {parseFloat(item.valorTotal).toFixed(2)}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link href="/adm/pedidos" className="btn text-white ms-2" style={{ backgroundColor: '#001969' }}>
        <FaArrowLeft /> Voltar
      </Link>
    </PaginaAdm>
  );
}
