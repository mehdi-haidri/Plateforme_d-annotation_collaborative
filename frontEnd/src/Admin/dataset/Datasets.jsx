import React, { useEffect } from 'react'
import Table from '../components/Table'

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
            field: 'Classes',
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
        },
    
    ]

  
      
    
    const fetchData = async () => {
        try {
          let response = await fetch('http://localhost:8080/app/v1/datasets/datasets');
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
                    action: 'edit'
                 })
                
            })
            setRows(rows);
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        fetchData();
      }, []);

   
  return (
      <>
          <div>
              <h1 className='m-5 font-bold text-2xl'>Datasets</h1>
          </div>
          <Table rows={rows}  colums={colums}/>
      </>
  )
}

export default Datasets