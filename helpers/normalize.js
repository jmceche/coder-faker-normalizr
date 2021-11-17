import { denormalize, normalize, schema } from "normalizr";
import util from 'util';

export const print = (objeto) => {
    console.log(util.inspect(objeto,false,12,true))
}

const author = new schema.Entity('authors', { }, {
  idAttribute: 'email'
  // idAttribute: (value, parent,key) => (`${value}-${parent}-${key}`)
});

const post = new schema.Entity('posts', {
  author,
});

const chat = new schema.Entity('chats', {
  mensajes: [post],
})

export const normalizeChat = (data) => {
  return normalize(data, chat);
};

export const denormalizeChat = (data) => {
  return denormalize(data, chat, data);
};