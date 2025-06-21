import { Suspense } from "react"
import SearchPage from './SearchPage';
export default function MainSearchPage(){
  function SearchBarFallback() {
    return <>Not Found</>
  }
  return(
    <>
     <Suspense fallback={<SearchBarFallback />}>
          <SearchPage />
        </Suspense>
    </>
  )
}