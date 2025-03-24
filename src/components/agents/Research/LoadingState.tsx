import {Circle} from 'lucide-react';

const LoadingState = () => {
    return (
       <div className='flex justify-center items-center h-full'>
            <Circle  className='animate-spin h-10 w-10 text-blue-500'/>
       </div>
    )
}

export default LoadingState;