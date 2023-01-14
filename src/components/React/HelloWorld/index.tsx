import { r } from '@/components/React';
import React from 'react';
const Hello = ({name}) => {
    return <h1 className="hello-world">{name}</h1>;
}
export default r(Hello);