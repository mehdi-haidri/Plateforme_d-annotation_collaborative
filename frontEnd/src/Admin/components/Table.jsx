
import { Link } from 'react-router-dom';
import roles from '../../config/roles';

const API_URL = import.meta.env.VITE_API_URL;
const Table = ({ colums, rows }) => {
  
  const handlDownload =  async(id) => {
    
    try {
      const response = await fetch(`${API_URL}datasets/download/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataset-${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove()
      
    }catch (error) {
      console.error(error);
    }
  }
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
              <td className="px-6 py-4 flex gap-2">
                <Link to={`${roles.ROLE_ADMIN}/datasets/${row.id}`}>
                  <button className="btn btn-soft btn-info">details</button>
                </Link>
                <button onClick={()=>handlDownload(row.id)} disabled = {row.advancement !=row.size} className='btn btn-soft btn-success'>
                  Download
                </button>
                       </td>
                          </tr>
                     
                  ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
