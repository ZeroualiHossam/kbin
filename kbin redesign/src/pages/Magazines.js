import React from 'react';
import MagazineList from '../components/commons/Magazine/magazines-list';

const Magazines = ({token }) => {
    return (
        <>
            <MagazineList token={token}/>
        </>
    );
}

export default Magazines;