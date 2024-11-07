"use client";

import Link from "next/link";
import { FaPlusCircle, FaArrowLeft, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { mask } from 'remask';
import Swal from "sweetalert2";
import PaginaAdm from "@/app/components/PaginaAdm";
import "../../styles/form.css";


export default function Page() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    setClientes(JSON.parse(localStorage.getItem("clientes")) || []);
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
        const dados = clientes.filter((item) => item.id !== id);
        localStorage.setItem("clientes", JSON.stringify(dados));
        setClientes(dados);
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
    <PaginaAdm titulo="Clientes">
      <Link href="/adm/clientes/form" className="btn text-white mb-3" style={{backgroundColor: '#001969'}}>
        <FaPlusCircle /> Novo 
      </Link>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Cidade</th>
            <th>UF</th>
            <th>CEP</th>
            <th>Logradouro</th>
            <th>Bairro</th>
            <th>Número</th>
            <th>Complemento</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/adm/clientes/form/${item.id}`}>
                  <FaEdit className="text-primary" />
                </Link>
                <MdDelete
                  title="Excluir"
                  className="text-danger"
                  onClick={() => excluir(item.id)}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.cpf}</td>
              <td>{item.telefone}</td>
              <td>{item.email}</td>
              <td>{item.cidade}</td>
              <td>{item.uf}</td>
              <td>{item.cep}</td>
              <td>{item.logradouro}</td>
              <td>{item.bairro}</td>
              <td>{item.numero}</td>
              <td>{item.complemento}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link href="/" className="btn text-white ms-2" style={{backgroundColor: '#001969'}}> 
        <FaArrowLeft /> Home
      </Link>
    </PaginaAdm>
  );
}
