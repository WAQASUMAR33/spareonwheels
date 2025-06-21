// pages/CategoryProductPage.js
'use client'
import { Suspense } from 'react';
import CategoryProductPage from './mainpage';
export default function MainCategoryProductPage(){
    function ProductFallback() {
        return <>placeholder</>
      }
    return(
        <>
        <Suspense fallback={<ProductFallback />}>
        <CategoryProductPage/>
        </Suspense>
        </>
    )
}