'use client'
import { useEffect } from 'react';
import dynamic from 'next/dynamic'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { CldImage } from 'next-cloudinary';
import { SEND } from '@/store'
// 
const Loader = dynamic(() => import('@/components/loading'), {ssr:false});
const Table = dynamic(() => import('@/components/table'), {ssr:false, loading:()=><Loader />})
const AddAPI = dynamic(() => import('@/components/forms/add/api'), {ssr:false, loading:()=><Loader />})
const EditAPI = dynamic(() => import('@/components/forms/edit/api'), {ssr:false, loading:()=><Loader />})
// 
export default () =>
{
    const { apiList, _category, _type, _plan, _tag, _trial, _featured, apiReloadList, apiListLoading } = useSelector((state) => state.models);
    const dispatch = useDispatch()
    // 
    const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm()
    const onSubmit = (data) =>{
        dispatch.models.SET({
            apiListLoading: true
        })
        SEND('api/list', data)
    }
    //
    const columns = [
        [ 'ID' ],
        [ 'Title', v => <>{v[1].length > 15 ? v[1].substr(0,30)+'...' : v[1]}</> ],
        [ 'External', v => <p className='cursor-pointer font-bold hover:underline' onClick={()=>window.open(v[12] || '#', '_blank', 'noopener, noreferrer')}>{v[12]&&v[12].length>10?v[12].substr(0,10)+'...' : v[12]}</p> ],
        [ 'Category', v => <>{JSON.parse(v[2]).join(', ')}</> ],
        [ 'Type' , v => <>{JSON.parse(v[3]).join(', ')}</> ],
        [ 'Description', v=> <>{v[4].substr(0,20)+'...'}</> ],
        [ 'Plan', v => <>{v[5][1]}</> ],
        [ 'Trial', v => <>{v[6][1]}</> ],
        [ 'Price ($)', v => <>{v[7]}</> ],
        [ 'Calls',  v => <>{v[8] || 'Unlimited'}</> ],
        [ 'Featured', v => <>{v[9][1]}</> ],
        [ 'Logo', v => <CldImage width="0" height="0" src={`https://res.cloudinary.com/ddv2aeipa/image/upload/v1719214653/${v[11]}`} sizes="100vw" alt={v[11]} className='h-auto w-8 m-auto' /> ] ,
        [ 'Delete', v=> <FontAwesomeIcon icon={faTrashCan} color='#E32636' className='cursor-pointer' onClick={()=>SEND('api/del', {id:v[0], title:v[1] })} /> ],
        [ 'Edit', v=> <FontAwesomeIcon icon={faPenToSquare} className='cursor-pointer' onClick={()=>dispatch.models.SET({M:{c:<EditAPI data={v} />}})} /> ]
    ];
    // 
    const searches = [
        [columns[3][0], _category, 'col-span-2'], 
        [columns[4][0], _type, 'col-span-1'], 
        [columns[6][0], _plan, 'col-span-1'], 
        [columns[7][0], _trial, 'col-span-1'], 
        [columns[10][0], _featured, 'col-span-1'], 
    ]
    // 
    const getD = (v) => 
    {
        dispatch.models.SET({
            apiListLoading: true
        })
        SEND('api/list', v)
    }
    useEffect(() => getD(), []);
    // 
    useEffect(() => 
    {
        if(!apiReloadList) return;
        getD()
        dispatch.models.SET({ apiReloadList: '' });
    }, [apiReloadList]);
    // 
    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
                <div className='grid grid-cols-12 gap-3 items-center'>
                    <TextField
                        label="Title" 
                        size="small"
                        className='col-span-2'
                        {...register('Title')}
                    />
                    <TextField
                        label="Description"
                        size="small"
                        className='col-span-2'
                        {...register('Description')}
                    />
                    {searches.map((v,k)=>(
                        <FormControl key={k} className={v[2]} size="small">
                            <InputLabel id={v[0]}>{v[0]}</InputLabel>
                            <Select 
                                id={v[0]}
                                labelId={v[0]}
                                {...register(v[0])}
                                value={getValues(v[0]) || ''}
                                label={v[0]}
                                onChange={event=>setValue(v[0], event.target.value, {shouldValidate: true})}
                            >
                                <MenuItem value="">
                                    <em>-Select {v[0]}-</em>
                                </MenuItem>
                                {v[1]&&v[1].map((vv,kk)=>(
                                    <MenuItem key={kk} value={vv[0]}>{vv[1]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}
                    <div>
                        <LoadingButton fullWidth loading={apiListLoading} variant="contained" type="submit">
                            Search
                        </LoadingButton>
                    </div>
                    <div>
                        <LoadingButton fullWidth loading={apiListLoading} variant="outlined" 
                            onClick={()=> {
                                SEND('api/list');
                                reset()
                            }}
                        >
                            Clear
                        </LoadingButton>
                    </div>
                </div>

                <div className='justify-end flex'>
                    <LoadingButton 
                        fullWidth
                        loading={apiListLoading}
                        variant="contained" 
                        onClick={()=>dispatch.models.SET({M:{c:<AddAPI />}})}
                    >
                        Create
                    </LoadingButton>
                </div>
            </div>
            
            <Table 
                columns={columns} 
                data={ apiList&&[
                    [apiList[0]||1, 500, apiList[0][2]], 
                    apiList[1]
                ]||[] }
                pageChange={getD}
            />
        </div>
    </form>
}