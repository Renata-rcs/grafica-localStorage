'use client';

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
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    setContatos(JSON.parse(localStorage.getItem("contatos")) || []);
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
        confirmButton: 'btn btn-primary', 
        cancelButton: 'btn btn-secondary' 
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const novosContatos = contatos.filter((item) => item.id !== id);
        localStorage.setItem("contatos", JSON.stringify(novosContatos));
        setContatos(novosContatos);
        Swal.fire({
          title: "Excluído!",
          text: "Registro foi excluído.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: 'btn btn-primary' 
          }
        });
      }
    });
  }

  return (
    <PaginaAdm titulo="Contatos">
      <Link href="/adm/contatos/form" className="btn text-white mb-3" style={{backgroundColor: '#001969'}}>
        <FaPlusCircle /> Novo
      </Link>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody>
          {contatos.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/adm/contatos/form/${item.id}`}>
                  <FaEdit className="text-primary" />
                </Link>
                <MdDelete
                  title="Excluir"
                  className="text-danger"
                  onClick={() => excluir(item.id)}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.telefone}</td>
              <td>{item.mensagem}</td>
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

