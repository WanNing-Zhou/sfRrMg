export default {
  path: import.meta.env.VITE_API_DOC_URL, // 文档地址
  name: 'doc',
  meta: {
    locale: 'menu.doc',
    icon: 'icon-question-circle',
    requiresAuth: true,
    order: 9,
  },
};
