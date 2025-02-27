import Lottie from 'react-lottie';
import animationData from '@/assets/jsons/loader.json'

const Loader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='h-screen w-full flex items-center justify-center bg-transparent'>
            <Lottie options={defaultOptions} height={400} width={400} />
        </div>
    );
};

export default Loader;
