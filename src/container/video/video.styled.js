import styled from 'styled-components'

export const Grid=styled.div`
    width: ${props=>props.columns}%;
`
export const Button=styled.button`
    border:none;
    background:black;
    color:white;
    /* width: 30px; */
    /* height:20px */
    margin: 20px ;
    padding : 15px 20px;
    border-radius:8px;
    font-weight:700;
    margin-top:20px;
`
export const Warntext=styled.p`
    color: red;
    font-weight:700;
    font-size:16px;
    margin: 20px ;
`
export const Skeleton = styled.div`
    animation: skeleton-loading 1s linear infinite alternate;
    width: 60vw;
    height: 450px;

    margin-bottom: 50px;
    border-radius: 15px;
    @keyframes skeleton-loading {
        0% {
            background-color: hsl(200, 20%, 80%);
        }
        100% {
            background-color: hsl(200, 20%, 95%);
        }
    }
`;