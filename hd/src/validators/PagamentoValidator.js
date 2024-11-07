import * as Yup from 'yup';


const PagamentoValidator = Yup.object().shape({
  numeroCartao: Yup.string()
     .min(19, 'O mínimo de caracteres é 19')
     .max(19, 'O máximo de caracteres é 19!')
    .required('Número do cartão é obrigatório'),
    
  data: Yup.string()
    .min(5, 'O mínimo de caracteres é 5')
    .max(5, 'O máximo de caracteres é 5!')
    .required('Data de validade é obrigatória Mês e Ano!'),
    
  cvc: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(3, 'O máximo de caracteres é 3!')
    .required('CVC é obrigatório')
    
});


export default PagamentoValidator;