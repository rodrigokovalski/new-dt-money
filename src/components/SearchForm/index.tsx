import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";

/**
 * Por que um componente renderiza?
 * 
 * Hook is changed (mudou um estado, um contexto, um reducer)
 * Props is changed (mudou propriedades)
 * Parent is rendered
 * 
 * Qual o fluxo de renderização?
 * 
 * 1. React recria o HTML da interface daquele componente (Na memória).
 * 2. Compara a versão criada com a versão anterior.
 * 3. SE mudou alguma coisa, reescreve o HTML na tela.
 * 
 * Com MEMO:
 * 
 * 0. Mudou alguma coisa nos hooks ou nas props do meu componente? Deep comparison.
 * 0.1 Comparar com a versão anterior dos hooks e props. [Isso aqui pode acabar sendo muuito mais lento do que recriar o HTML do zero]
 * 0.2 SE mudou alguma coisa, ele vai permitir a nova renderização.
 * 
 * (Só usamos em componentes que tenham HTML muuito pesado). 
 */

const searchFormSchema = z.object({
    query: z.string()
})

type SearchFormInputs = z.infer<typeof searchFormSchema>;

export function SearchForm() {
    const fetchTransactions = useContextSelector(TransactionsContext, (context) => context.fetchTransactions);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<SearchFormInputs>({
        resolver: zodResolver(searchFormSchema)
    });


    async function handleSearchTransactions(data: SearchFormInputs) {
        await fetchTransactions(data.query);
    }

    return (
        <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
            <input
                type="text"
                placeholder="Busque por transações"
                {...register('query')}
            />

            <button type="submit" disabled={isSubmitting}>
                <MagnifyingGlass size={20} />
                Buscar
            </button>
        </SearchFormContainer>
    );
}