"use client";

import PaginaAdm from "@/app/components/PaginaAdm";
import Link from "next/link";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../styles/form.css";

export default function Page() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    setProdutos(JSON.parse(localStorage.getItem("produtos")) || []);
  }, []);
 

  function excluir(id) {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Não, cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButtonText: "btn btn-secondary",
      },
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const dados = produtos.filter((item) => item.id !== id);
        localStorage.setItem("produtos", JSON.stringify(dados));
        setProdutos(dados);
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
    <PaginaAdm titulo="Produtos">
      <Link href="/adm/produtos/form" className="btn text-white mb-3" style={{backgroundColor: '#001969'}}>
        <FaPlusCircle /> Novo
      </Link>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome do Produto</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Medida</th>
            <th>Peso</th>
            <th>Valor Unitário</th>
            <th>Serviço</th>
            <th>Imagem do Produto</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/adm/produtos/form/${item.id}`}>
                  <FaEdit title="Editar" className="text-primary" />
                </Link>
                <MdDelete
                  title="Excluir"
                  className="text-danger"
                  onClick={() => excluir(item.id)}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.descricao}</td>
              <td>{item.quantidade}</td>
              <td>{item.medida}</td>
              <td>{item.peso}</td>
              <td>{item.valorUnitario}</td>
              <td>{item.servico}</td>
              <td>
                <img src={item.imagemUrl} alt={item.nome} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link href="/adm" className="btn text-white ms-2" style={{backgroundColor: '#001969'}}>
        <FaArrowLeft /> Voltar
      </Link>
    </PaginaAdm>
  );
}
