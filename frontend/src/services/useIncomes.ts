// import { useState, useEffect } from 'react';
// import { useBoolean } from '@betrybe/ada-react';

// import type { IncomeProps } from 'types';

// import useRequests from './useRequests';

// type IncomesParams = {
//   isStudent: boolean;
// }

// const URL = '/api/career_tracking/v1/incomes';

// function useIncomes({ isStudent }: IncomesParams) {
//   const { getRequest, putRequest } = useRequests();
//   const [isLoading, { setFalse }] = useBoolean(true);
//   const [incomes, setIncomes] = useState<IncomeProps[]>([]);
//   const [income, setIncome] = useState<IncomeProps>();

//   useEffect(() => {
//     const requestIncomes = async () => {
//       const response = await getRequest<IncomeProps[]>(URL);
//       switch(isStudent) {
//         case true:
//           setIncome(response.data[0]);
//           break;
//         default:
//           setIncomes(response.data);
//       }
//         setFalse();
//     };
//     requestIncomes();
//   }, [getRequest, isStudent, setFalse]);

//   const putIncomes = async (incomeId: string, params: object) => {
//     const { data } = await putRequest<IncomeProps>(`${URL}/${incomeId}`, params)
//     return data;
//   }

//   return { incomes, income, isLoading, putIncomes };
// }

// export default useIncomes;
