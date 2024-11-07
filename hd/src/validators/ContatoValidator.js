import * as Yup from 'yup';

const ContatoValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  telefone: Yup.string()
    .min(10, 'O mínimo de caracteres é 10')
    .max(15, 'O máximo de caracteres é 15!')
    .required('Campo Obrigatório!'),

  mensagem: Yup.string()
    .min(10, 'A mensagem deve ter no mínimo 10 caracteres.')
    .max(500, 'A mensagem deve ter no máximo 500 caracteres.')
    .required('Campo Obrigatório'),
});

export default ContatoValidator;
