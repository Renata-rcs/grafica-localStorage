import * as Yup from 'yup';

const ServicoValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  descricao: Yup.string()
    .max(200, 'O máximo de caracteres é 200!')
    .min(3, 'O mínimo de caracteres é 3')
    .required('Campo Obrigatório'),

  material: Yup.string()
    .max(100, 'O máximo de caracteres é 100!')
    .min(3, 'O mínimo de caracteres é 3')
    .required('Campo Obrigatório'),

  responsavel: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),
});

export default ServicoValidator;
