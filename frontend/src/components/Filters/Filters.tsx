import { AxiosError } from 'axios';
import { FormEvent, useContext } from 'react';

import { Button, Checkbox } from '../';
import { AuthContext, TransactionType } from '../../contexts/AuthContext';
import { useRequests } from '../../services';

export function Filters() {
  const { setUser } = useContext(AuthContext);
  const { getRequest } = useRequests();

  const handleFilter = async (event: FormEvent) => {
    event.preventDefault();

    const formValues = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(formValues);

    const date = formData?.date && formData?.select_date ? `date=${formData.date}` : '';
    const type = formData?.type;

    try {
      const { data } = await getRequest<TransactionType[]>(`/transactions/?type=${type}&${date}`, formData);
      setUser(prevState => {
        if (prevState) return {
          ...prevState,
          transactions: data,
        }
        return prevState;
      });

      alert('Sucesso!');
    }
    catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        alert(response?.data?.message);
      }
    }
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col items-start px-2 py-2 justify-between border">
      <div className="flex gap-4">
        <label htmlFor="select-date" className="flex items-center gap-2">
          <Checkbox id="select-date" name="select_date"/>
        </label>

        <label>
          <input className="bg-ng-gray-main px-1 py-1 rounded" type="date" name="date" id="date" />
        </label>
      </div>

      <div className="flex w-full items-center justify-between gap-1">
        <fieldset className="text-black flex items-end gap-2">
          <div>
            <input className="m-1" type="radio" id="all" name="type" value=""/>
            <label htmlFor="all">All</label>
          </div>

          <div>
            <input className="m-1" type="radio" id="cash-in" name="type" value="cash-in" />
            <label htmlFor="cash-in">Cash-in</label>
          </div>

          <div>
            <input className="m-1" type="radio" id="cash-out" name="type" value="cash-out" />
            <label htmlFor="cash-out">Cash-out</label>
          </div>
        </fieldset>

        <Button type="submit" className="w-3/12 bg-ng-green-main hover:bg-ng-green-hover">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
