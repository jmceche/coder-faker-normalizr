import { denormalize, normalize, schema } from "normalizr";
import util from 'util';

export const print = (objeto) => {
    console.log(util.inspect(objeto,false,12,true))
}

const author = new schema.Entity('authors', { }, {
  idAttribute: 'email'
});

const post = new schema.Entity('posts', {
  author,
}, {idAttribute: '_id'});

const chat = new schema.Entity('chats', {
  mensajes: [post],
})

export const normalizeChat = (data) => {
  const jsonData = JSON.parse(data);
  const normData = normalize(jsonData, chat);
  return normData;
};

export const denormalizeChat = (data) => {
  return denormalize(data, chat, data);
};