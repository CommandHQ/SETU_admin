import React from 'react';
import Image from 'next/image';
import CountChart from './CountChart';
import { db } from '@/lib/db';
import { UserCheck2 } from 'lucide-react';


const CountChartContainer = async () => {
    const data = await db.user.groupBy({
        by:["gender"],
        _count : true,
    })
    const boys = data.find(d=>d.gender==="Male")?._count || 0;
    const girls = data.find(d=>d.gender==="Female")?._count||0;
  return (
    <div className='bg-white w-full h-full p-4 rounded-2xl shadow-md'>
        {/* TITLE */}
        <div className='flex items-center justify-between'>
            <h1 className='font-semibold text-lg '>Users</h1>
            <UserCheck2/>
        </div>
        {/* CHART */}
            <CountChart boys={boys} girls={girls}/>
        {/* BOTTOM */}
        <div className='flex justify-center gap-16'>
            <div className='flex flex-col gap-1'>
                <div className='h-5 w-5 bg-colors-lamaSky rounded-full'></div>
                    <h1 className='font-semibold '>{boys}</h1>
                    <h1 className='text-xs text-gray-300'>Mens ({(boys/(boys+girls))*100}%)</h1>
            </div>
            <div className='flex flex-col gap-1'>
                <div className='h-5 w-5 bg-colors-lamaYellow rounded-full'></div>
                    <h1 className='font-semibold '>{girls}</h1>
                    <h1 className='text-xs text-gray-300'>Women s ({(girls/(girls+boys))*100}%)</h1>
            </div>
        </div>
    </div>
        
  )
}

export default CountChartContainer