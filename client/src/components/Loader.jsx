import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false }) => {
    return (
        <div className={`flex justify-center items-center ${fullPage ? 'h-screen' : 'h-full py-10'}`}>
            <Loader2 className="w-8 h-8 animate-spin text-agro-600" />
        </div>
    );
};

export default Loader;
