'use client'
import { useSelector, useDispatch } from 'react-redux';
import { SEND } from '@/store';
import { useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { Box, Skeleton } from '@mui/material';
// 
export default () =>
{
    const { MyFavourties } = useSelector((state) => state.models);
    const { api_favourties } = useSelector((state) => state.apis);
    // 
    const dispatch = useDispatch()
    const router = useRouter()
    // 
    useEffect(()=>{
        if(api_favourties&&api_favourties.length==0) return
        SEND('api/favour', {api_ids: api_favourties});
    },[])
    //  
    return <div className='py-16 px-2'>
        <div className="xl:w-[1400px] m-auto">
        <div className='mb-2 text-sm'>
            <span className='bg-[#f2f2f2] px-2 py-1 shadow border-l-2 mb-2 border-black'>My Favourites</span>
        </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'> 
                {!api_favourties&&!MyFavourties  ? <>
                        {Array.from(new Array(12)).map((item, index) => (
                            <Skeleton key={index} variant="rectangular" width={"100%"} height={180} />
                        ))}
                    </>
                :
                api_favourties.length==0 ?  <>No Favourties found.</> : MyFavourties&&MyFavourties.map((v,k)=>(
                    <div 
                        key={k} 
                        className='flex flex-col gap-4 rounded bg-white p-4 border cursor-pointer'
                        onClick={()=>{
                            dispatch.models.SET({showSubContent:v})
                            router.push('/')
                        }}
                    >
                        <div className='flex items-center gap-4'>
                            <div>
                                <CldImage 
                                    width="0" 
                                    height="0" 
                                    // src={'public_api/'+apis[k]['img']+'.png'} 
                                    src={`https://res.cloudinary.com/ddv2aeipa/image/upload/v1719214653/${v['img']}`} 
                                    sizes="100vw" alt={v['img']} 
                                    className='h-auto w-12 m-auto' 
                                />
                            </div>
                            <div>
                                <h3 className='cursor-pointer text-2xl font-bold hover:underline'>{v['title']}</h3>
                                <div className='flex flex-col gap-2'>
                                    {/* <div className='flex items-center gap-1'>
                                        <i className='fa fa-xs'>{String.fromCharCode(parseInt(v['type'][1],16))}</i>
                                        <small>{v['type'][0]}</small>
                                    </div> */}
                                    <div className='flex items-center gap-1'>
                                    {/* <i className='fa fa-xs'>{String.fromCharCode(parseInt(apis[k]['type'][1],16))}</i> */}
                                    {/* <p className='m-0'>{apis[k]['type'][0]}</p> */}
                                        {JSON.parse(v['type']).map((v,k)=>(
                                            <p key={k} className='m-0 border px-1 cursor-pointer rounded'>{v}</p>
                                        ))}
                                    </div>
                                    <div className='flex flex-wrap items-center gap-1'>
                                        {/* <i className='fa fa-xs'>{String.fromCharCode(parseInt(apis[k]['category'][1],16))}</i> */}
                                        {/* <p className='m-0'>{apis[k]['category'][0]}</p> */}
                                        {JSON.parse(v['category']).length> 4 ? 
                                            JSON.parse(v['category']).slice(0,3).map((v,k)=>(
                                                <p
                                                    key={k} 
                                                    className='m-0 border px-1 cursor-pointer'
                                                    onClick={() => {
                                                        router.push('/'+v.toLowerCase().replace(/ /g, "_"));
                                                        dispatch.models.SET({onCategory:v})
                                                    }}
                                                >{v}1</p>
                                            ))
                                            :  JSON.parse(v['category']).map((v,k)=>(
                                            <p 
                                                key={k} 
                                                className='m-0 border px-1 cursor-pointer rounded'
                                                onClick={() => {
                                                    router.push('/'+v.toLowerCase().replace(/ /g, "_"));
                                                    dispatch.models.SET({onCategory:v})
                                                }}    
                                            >{v}</p>
                                        ))}
                                        {JSON.parse(v['category']).length> 4 ?  <p key={k} className='m-0 border px-1 cursor-pointer'>Show More</p> :<></>}
                                    </div>
                                    {/* <div className='flex items-center gap-1'>
                                        <i className='fa fa-xs'>{String.fromCharCode(parseInt(v['category'][1],16))}</i>
                                        <small>{v['category'][0]}</small>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className='text-sm'>
                            <p className='text-[#4e4e4e]'>
                                {v['description'].substring(0,85) + '...'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}