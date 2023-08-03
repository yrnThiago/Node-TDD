import Autor from './../../models/autor';
import { describe, expect, it, jest } from "@jest/globals";

describe('Testando o modelo Autor', () => {
    const objetoAutor = {
        nacionalidade: 'Brasileiro',
        nome: 'Junin'
    };

    it('Deve instanciar um novo autor', () => {
        const autor = new Autor(objetoAutor);

        expect(autor).toEqual(
            expect.objectContaining(objetoAutor)
        );
    });

    it('Deve salvar um autor fazendo uma chamada simulada ao BD', () => {
        const autor = new Autor(objetoAutor);

        autor.salvar = jest.fn().mockReturnValue({
            id: 10,
            nome: 'Junin',
            nacionalidade: 'Brasileiro',
            created_at: '2022-10-01',
            updated_at: '2022-10-01',
        });

        const retorno = autor.salvar();

        expect(retorno).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                ...objetoAutor,
                created_at: expect.any(String),
                updated_at: expect.any(String),
            })
        )
    });

    it('Deve atualizar dados do autor fazendo uma chamada simulada ao BD', () => {
        const autor = new Autor(objetoAutor);
        const novoObjetoAutor = {
            nome: 'Junior',
            nacionalidade: 'Estrangeiro',
        }

        autor.atualizar = jest.fn().mockReturnValue(novoObjetoAutor);

        const retorno = autor.atualizar();

        expect(retorno).toEqual(
            expect.objectContaining({
                ...novoObjetoAutor,
            })
        )
    });
})