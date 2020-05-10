// eslint-disable-next-line spaced-comment
/*eslint no-duplicate-imports: ["error", { "includeExports": true }] */
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
