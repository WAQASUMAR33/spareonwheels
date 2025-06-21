import CustomerLayout from "../customer/layout";

export default function Layout({children}){
    return(
        <>
        <CustomerLayout>
            {children}
        </CustomerLayout>
        </>
    )
}