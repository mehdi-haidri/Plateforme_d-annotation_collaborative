import React from 'react';

const Table = ( {colums , rows}) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      
                      {
                          colums.map((col) => (
                              <th key={col.field} scope="col" className="px-6 py-3">
                                  {col.field}
                              </th>
                          ))
                      }
           
          </tr>
        </thead>
        <tbody>
         

                  {rows.map((row) => (
                       <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                       <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.id}</td>
                       <td className="px-6 py-4">{row.name}</td>
                       <td className="px-6 py-4">{row.size}</td>
                       <td className="px-6 py-4">{row.classes}</td>
                       <td className="px-6 py-4">{row.advancement}</td>
                       <td className="px-6 py-4 text-right">
                         <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          { row.status ? 'annotated' : 'not annotated' }
                         </a>
                       </td>
                       <td className="px-6 py-4">{row.action}</td>
                          </tr>
                     
                  ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
