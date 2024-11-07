import * as Yup from 'yup';

const ProdutoValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  descricao: Yup.string()
    .min(5, 'O mínimo de caracteres é 5')
    .max(200, 'O máximo de caracteres é 200!')
    .required('Campo Obrigatorio!'),

  quantidade: Yup.number()
    .min(1, 'A quantidade deve ser pelo menos 1')
    .required('Campo Obrigatório'),

  medida: Yup.string()
    .min(1, 'A medida é obrigatória')
    .required('Campo Obrigatório'),

  peso: Yup.string()
    .min(1, 'O peso deve ser maior ou igual a um!')
    .required('Campo Obrigatório'),

  servico: Yup.string()
    .min(6, 'O minímo de caracteres é 6!')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatorio'),

  valorUnitario: Yup.number()
    .min(1, 'O valor unitário deve ser maior ou igual a um!')
    .required('Campo Obrigatório'),

  imagemUrl: Yup.string()
    .required('Campo Obrigatório'),
});

export default ProdutoValidator;
