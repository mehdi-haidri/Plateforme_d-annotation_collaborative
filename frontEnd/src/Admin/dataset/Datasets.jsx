import React, { useEffect } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom';
import roles from '../../config/roles';
const   API_URL = import.meta.env.VITE_API_URL;
function Datasets() {

    const [rows, setRows] = React.useState([]);

    const colums = [
        {
            field: 'id',
            width: 70,
          },
          {
            field: 'name',
            width: 130,
          },
          {
            field: 'size',
            width: 130,
          },
        {
            field: 'classes',
            width: 90,
        },
        {
            field: 'advancement',
            width: 90,
        },
        {
            field: 'status',
            width: 90,
        },
        {
            field: 'action',
            width: 90,
        }
    
    ]

  
      
    
    const fetchData = async () => {
        try {
          let response = await fetch(API_URL+'datasets/datasets', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          });
          if (!response.ok) {
           throw new Error('Network response was not ok');
           }
            response = await response.json();
            let rows = []
            response.data?.datasets.map((dataset) => {
                 rows.push({
                    id: dataset.id,
                    name: dataset.name,
                    size: dataset.size,
                    classes: dataset.numberClasses,
                    advancement: dataset.advancement,
                    status: dataset.annotated,
                  
                 })
                
            })
          console.log(response);
            setRows(rows);
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        fetchData();
      }, []);

   
  return (
      <div>
          <div>
              <h1 className='m-5 font-bold text-2xl'>Datasets</h1>
      </div>
      
      <div>
        <button type="button" className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          <Link to={`${roles.ROLE_ADMIN}/datasets/addDataset`} >Add + </Link></button>
      </div>
          <Table rows={rows}  colums={colums}/>
      </div>
  )
}

export default Datasets