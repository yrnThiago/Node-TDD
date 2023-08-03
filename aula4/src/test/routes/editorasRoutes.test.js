import { afterEach, jest } from '@jest/globals';
import app from '../../app.js';
import request from 'supertest';

let server;
beforeEach( () => {
    const port = 3000;
    server = app.listen(port);
});

afterEach( () => {
    server.close();
})

describe('GET em /editoras', () => {
    it('Deve retornar uma lista de editoras', async () => {
        const resposta = await request(app)
            .get('/editoras')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(resposta.body[0].email).toEqual('e@e.com');
    });
})

let idResposta;
describe('POST em /editoras', () => {
    it('Deve adicionar uma nova editora', async () => {
        const resposta = await request(app)
            .post('/editoras')
            .send({
                nome: 'CDC',
                cidade: 'Sao Paulo',
                email: 'c@c.com',
            })
            .expect(201);

        idResposta = resposta.body.content.id;
    });

    it('Deve nao adicionar nada ao passar o body vazio', async () => {
        await request(app)
            .post('/editoras')
            .send({})
            .expect(400);
    });
})

describe('GET em /editoras/id', () => {
    it('Deve retornar o recurso selecionado', async () => {
        await request(app)
            .get(`/editoras/${idResposta}`)
            .expect(200);
    });
})

describe('Get em /editoras/id/livros', () => {
    it('Deve retornar os livros da editora selecionada', async () => {
        const resposta = await request(app)
            .get(`/editoras/${idResposta}/livros`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(resposta.body).toHaveProperty('livros');
    });

    it('Deve retornar erro 404, editora não encontrada', async () => {
        const resposta = await request(app)
            .get(`/editoras/${99999999999}/livros`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(resposta.body.message).toBe("Editora ID não encontrado");
    });
});

describe('PUT em /editoras/id', () => {
    test.each([
        ['nome', {nome: 'Casa do Codigo'}],
        ['cidade', {cidade: 'SP'}],
        ['email', {email: 'cdc@cdc.com'}]
    ])('Deve alterar o campo %s', async (chave, param) => {

        const requisicao = { request };
        const spy = jest.spyOn(requisicao, 'request');
        await requisicao.request(app)
            .put(`/editoras/${idResposta}`)
            .send(param)
            .expect(204);

        expect(spy).toHaveBeenCalled();
    })
})

describe('DELETE em /editoras/id', () => {
    it('Deve deletar o recurso adicionado', async () => {
        await request(app)
            .delete(`/editoras/${idResposta}`)
            .expect(200);
    });
})
