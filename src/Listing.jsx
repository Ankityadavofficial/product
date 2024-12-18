import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

export default function Listing() {
    const { category_slug } = useParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loader, setLoader] = useState(false)
    const [productname, setProductName] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const limit = 10;
    const [totalPages, setTotalPage] = useState(0)
    const [currentPages, setCurrentPage] = useState(0)

    useEffect(
        () => {
            const query = new URLSearchParams();
            query.append('page', currentPages);
            setSearchParams(query);
            setLoader(true);
            // query.append('limit',limit)
            let API ='';
            if(category_slug != null){
                API=`https://dummyjson.com/products/category/${category_slug}?skip=${limit * currentPages}&limit=${limit} `
            }else{
                API=`https://dummyjson.com/products/?skip=${limit * currentPages}&limit=${limit} `
            }
            // console.log(API)
            axios.get(API)
                .then(
                    (success) => {
                        setProducts(success.data.products);
                    }
                )
                .catch(
                    (err) => {

                    }
                )
                .finally(
                    () => {
                        setLoader(false)
                    }
                )
        }, [currentPages]
    )

    let pagination = [];
    for (let i = 0; i < totalPages; i++) {
        pagination.push(<li key={i} onClick={() => setCurrentPage(i)} style={{
            backgroundColor: i == currentPages ? 'lightblue' : ''
        }} className='py-2 mt-1 px-4 border cursor-pointer'>{i + 1}</li>)

    }

    useEffect(
        () => {
            const queryProductName = searchParams.get('q');
            if (queryProductName != null) {
                setProductName(queryProductName);
                }
            setLoader(true)
            axios.get('https://dummyjson.com/products/categories')
                .then(
                    (success) => {
                        setCategories(success.data);
                    }
                )
                .catch(
                    (error) => {

                    }
                )
                .finally(
                    () => {
                        setLoader(false)
                    }
                )
        },
        []
    )

    useEffect(
        () => {
            if (searchParams.get('q') != null) return;

            if (category_slug != null) {
                setProductName("")
            }
            setLoader(true)
            let API = '';
            if (category_slug == null) {
                API = `https://dummyjson.com/product?limit=${limit}`

            } else {
                API = 'https://dummyjson.com/products/category/' + category_slug;
            }
            axios.get(API)
                .then(
                    (success) => {
                        setProducts(success.data.products);
                        const totle_page = Math.ceil(success.data.total / limit);
                        setTotalPage(totle_page)
                    }
                )
                .catch(
                    (err) => {

                    }
                )
                .finally(
                    () => {
                        setLoader(false)
                    }
                )
        }, [category_slug]
    )

    useEffect(
        () => {
            if (productname != '') {
                const query = new URLSearchParams();
                query.append('q', productname);
                // query.append('limit', 10);// to be changed
                setSearchParams(query);
                axios.get(`https://dummyjson.com/products/search?q=${productname}`)
                    .then(
                        (success) => {
                            setProducts(success.data.products);
                        }
                    )
                    .catch(
                        (err) => {

                        }
                    )
                    .finally(
                        () => {
                            setLoader(false)
                        }
                    )
            }
            else {
                setSearchParams('');
            }
        },
        [productname]
    )
    return (
        <div className="bg-white p-2">
            <div className="grid grid-cols-4 py-2 max-w-[1240px] mx-auto ">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h2>
                    <ul>
                        <Link to='/'>
                            <li className={`p-2 my-1 shadow ${category_slug == null ? 'text-blue-600' : ''}`} >All</li>
                        </Link>
                        {
                            categories.map(
                                (cat, i) => {
                                    return (
                                        <Link key={i} to={`/${cat.slug}`}>
                                            <li
                                            key={i} className={`p-2 my-1 shadow ${category_slug == cat.slug ? 'text-blue-500' : ''}`} >
                                                {cat.name}
                                            </li>
                                        </Link>
                                    )
                                }
                            )
                        }
                    </ul>
                </div>
                <div className="col-span-3 px-4 lg:px-8 ">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
                    <ul className="max-w-[1240px] mx-auto flex ">{pagination}</ul>
                    <div style={{
                        display: category_slug != null ? 'none' : ''
                    }} >
                        <input
                            disabled={category_slug == null ? false : true}
                            onChange={(e) => setProductName(e.target.value)}
                            value={productname}
                            type="search"
                            id="first_name"
                            className="mt-3 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Product Name"
                            required=""
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">

                        {
                            loader == true
                                ?
                                [1, 2, 3, 4].map(
                                    (d) => {
                                        return (
                                            <div key={d} className="bg-white  w-[267px] rounded-lg shadow-sm animate-pulse">
                                                <div className="h-48 w-full bg-gray-300 rounded-t-lg" />{" "}
                                                <div className="px-4 h-48 py-2">
                                                    <div className="h-4 bg-gray-300 rounded-full mb-2" />{" "}
                                                    <div className="h-2 bg-gray-300 rounded" />
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                                :
                                products.map((product) => (
                                    <div key={product.id} className="group relative">
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-sm text-gray-700">
                                                    <Link to={"/product/" + product.id}>
                                                        <span aria-hidden="true" className="absolute inset-0" />
                                                        {product.title}
                                                    </Link>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">Stocks : {product.stock}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                        </div>
                                    </div>
                                )
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
