import * as Yup from 'yup';

const PedidoValidator = Yup.object().shape({


  dataPedido: Yup.date()
    .required('Campo Obrigatório')
    .typeError('Data inválida'),

  status: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  valorTotal: Yup.number()
    .min(0, 'O valor total deve ser maior ou igual a zero')
    .required('Campo Obrigatório'),

  produtos: Yup
          .array()
          .required('Campo Obrigatório'),

  quantidade: Yup.number()
          .min(1, 'A quantidade deve ser pelo menos 1'),

  valorUnitario: Yup.number()
          .min(0, 'O valor unitário deve ser maior ou igual a zero'),
          
  // imagemProduto: Yup
  //       .array() 
  //       .of(Yup.string('O campo precisa ser uma string')) 
  //       .notRequired() 
   
      })


export default PedidoValidator;
