"use client"
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { SEND } from '@/store'
import { cats } from '@/utils/data'
// 
export default () =>
{
    const { onCategory, showSubContent, _category } = useSelector((state) => state.models);
    // 
    const pathname = usePathname()
    if(pathname.split('/')[1]=='admin' || pathname.split('/')[1]=='login' || pathname.split('/')[1]=='learn') return <></>
    // 
    const dispatch = useDispatch()
    // if(showSubContent) return <></>
    // 
    return <div className='flex flex-wrap gap-2 px-2 xl:px-0 text-sm py-5'>
        <Link 
            href='home'
            className={'flex items-center gap-2 bg-[#edf2f7] px-3 py-1 cursor-pointer rounded border hover:bg-gray-700 hover:text-white '+(onCategory=='home' ? 'bg-gray-700 text-white':' ')}
            onClick={()=>{dispatch.models.SET({onCategory:'home'})}}
        >
            <i className='fa'>&#xf015;</i>
            <div>Home</div>
        </Link>
        {(_category || cats).map((v,k)=>(
            <Link 
                key={k} 
                href={v[1].toLowerCase().replace(/ /g, "_")}
                className={'flex items-center gap-2 bg-[#edf2f7] px-3 py-1 cursor-pointer rounded border hover:bg-gray-700 hover:text-white '+(onCategory==v[1] ? 'bg-gray-700 text-white':' ')}
                onClick={()=>dispatch.models.SET({onCategory:v[1]})}
            >
                <i className='fa'>{String.fromCharCode(parseInt(v[2],16))}</i>
                <div>{v[1]}</div>
            </Link>
        ))}
    </div>
}