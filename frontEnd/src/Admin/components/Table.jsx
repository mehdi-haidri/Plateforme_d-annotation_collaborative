
import { Link } from 'react-router-dom';
import roles from '../../config/roles';

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
              {  colums.map((col , index) => {
                if (col.field !== 'id' && col.field !== 'action' && col.field !== 'status') {
                  
                  return (
                    <td key={index} className="px-6 py-4">{row[col.field]}</td>
                  )
                }
              })}
                        <td className="px-6 py-2 ">
                         <Link to={`${roles.ROLE_ADMIN}/datasets/add-annotators/${row.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          { row.status ? 'annotated' : <button  className="btn btn-soft btn-warning">Add annotators</button> }
                         </Link>
                       </td>
              <td className="px-6 py-4">
                <Link to={`${roles.ROLE_ADMIN}/datasets/${row.id}`}>
                  <button className="btn btn-soft btn-info">details</button>
                </Link>
                       </td>
                          </tr>
                     
                  ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
