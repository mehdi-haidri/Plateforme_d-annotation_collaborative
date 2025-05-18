import  { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
import TextAnnotationCard from '../Components/TextAnnotationCard';


function TextCouples() {
    const {task_id} = useParams();
    const [textCouple, setTextCouple] = useState({});
    const [classes, setClasses] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [annotated, setAnnotated] = useState(false);
    const [currentClasse, setCurrentClasse] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const { setAlert } = useOutletContext();
    const fetchLatestTextCouple = async () => {
        try {
            let response = await fetch(
                API_URL + `annotator/task/${task_id}/lastAnnotated`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log(response);
            let data = await response.json();
            setTextCouple(data.data?.textCouple);
            setClasses(data.data?.classes);
            setTotalPages(data.data?.totalPages);
            setCurrentIndex(data.data?.index);
            if (data.data?.annotated) {
                setAnnotated(true);
                setCurrentClasse(data.data?.currentClasse);
            }
            console.log(data);
        } catch (error) {
            setAlert({ type: "error", message: "server Error" });
            console.error(error);
        }
    }
    
    useEffect(() => {
        fetchLatestTextCouple();
    }, []);
  return (
    <div className="flex justify-center mt-10">
      <TextAnnotationCard totalPages={totalPages} index={currentIndex} currentClasse={currentClasse} isAnnotated={annotated}  classes={classes} data={textCouple} />
    </div>
  )
}



export default TextCouples