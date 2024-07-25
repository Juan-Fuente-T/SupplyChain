import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS } from './constants'
import { abi } from './assets/abis/supplychainMod.ts'
import { useEffect, useState } from 'react'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from './main'
import { toast } from 'react-toastify'
// import { isAddress } from 'viem/utils'; 
// import truncateEthAddress from 'truncate-eth-address';


function App(): JSX.Element {
  // const { address, isConnected } = useAccount();
  const { address } = useAccount();
  // const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const safeAddress = address?? 'Please, connect your wallet'; // Se utiliza este string como placeholder
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');//Mejorar esto, asegurar, guardar, etc
  // const [participantAddress, setParticipantAddress] = useState('');//Mejorar esto, asegurar, guardar, etc
  const [participantType, setParticipantType] = useState('');
  const [participantAddress, setParticipantAddress] = useState("");
  const [productId, setProductId] = useState(0);
  const [_productId, set_ProductId] = useState(0);
  const [ownerId, setOwnerId] = useState(0);//deberia ser la address conectada si solo puede dar de alta producto un manufacturer conectado
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [productCost, setProductCost] = useState(0);
  const [partNumber, setpartNumber] = useState(0);
  const [user1, setUser1] = useState(0);
  const [user2, setUser2] = useState(0);
  const [theProductId, setTheProductId] = useState(0);
  let [participantId, setParticipantId] = useState(0);//Esta bien como cero???
  
  
  // Estados para almacenar los datos leídos del contrato
  const [participantData, setParticipantData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [provenanceData, setProvenanceData] = useState<any>(null);
  const [ownershipData, setOwnershipData] = useState<any>(null);
  // const [actualProductId, setActualProductId] = useState<any>(null);
  // const [actualParticipantId, setActualParticipantId] = useState<any>(null);
  // const [actualOwnerIdData, setActualOwnerIdData] = useState<any>(0);
  // const [participantList] = useState<any[]>([]);



// const ownerNumber = productData ? productData[1] : '';
// const participant_type = participantData ? JSON.stringify(participantData[1]) : '';
const participant_type = productData ? JSON.stringify(productData[3]) : '';
// const participant_name = participantData ? JSON.stringify(participantData[0]) : '';
  // let partId;
  let partData: any;

  // const { data, isLoading, refetch } = useReadContract({

    console.log("partData", partData);
    console.log("participantId", participantId);
    console.log("productId", productId);
    // const { data: participant, refetch: refetchParticipant } = useReadContract({
    const { refetch: refetchParticipant } = useReadContract({
    // const { participant, refetch } = useReadContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: 'getParticipant',
      args: [participantId],
    })
    // setParticipantData(participant);
  // const { data, refetch } = useReadContract({
  console.log("productId1", productId);
  const { data: product, refetch: refetchProduct } = useReadContract({    
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getProduct',
    args: [productId],
  })
  // const { data, refetch } = useReadContract({
    console.log("productId2", productId);
    const { data: provenance, refetch: refetchProvenance } = useReadContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: 'getProvenance',
      args: [productId],
    })
  // setProvenanceData(provenance);
  // const { data, refetch } = useReadContract({
    console.log("productId3", productId);
    // const { data: ownership, refetch: refetchOwnership } = useReadContract({
    const { refetch: refetchOwnership } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getOwnership',
    args: [productId || _productId],
  })
  //   const { data: actualOwnerId, refetch: refetchActualOwnerId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'owner_id',
  // })
  //   const { data: actual_ParticipantId, refetch: refetchActualParticipantId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'participant_id',
  // })
  //   const { data: actual_productId, refetch: refetchActualProductId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'product_id',
  // })
 
  

  const fetchParticipantData = async () => {
    const result: any = await refetchParticipant();
    partData = result.data;
    setParticipantData(result.data);
  };
  
  const fetchProductData = async () => {
    const result = await refetchProduct();
    setProductData(result.data);
  };
  
  const fetchProvenanceData = async () => {
    const result = await refetchProvenance();
    setProvenanceData(result.data);
  };
  
  const fetchOwnershipData = async () => {
    const result = await refetchOwnership();
    setOwnershipData(result.data);
  };
  // const fetchActualOwnerIdData = async () => {
  //   const result = await refetchActualOwnerId();
  //   setActualOwnerIdData(result.data);
  // };
  // const fetchActualParticipantIdData = async () => {
  //   const result = await refetchActualParticipantId();
  //   setActualParticipantId(result.data);
  // };
  // const fetchActualProductId = async () => {
  //   const result = await refetchActualProductId();
  //   setActualProductId(result.data);
  // };

  // function getParticipants(){
  //   for (let i = 0; i < actualParticipantId; i++){
  //     // partId = i;
  //     fetchParticipantData();
  //     console.log(partData);
  //     participantList[i] = partData;
  //   }
    
  // }
  
  console.log("ParticipantData",participantData);
  console.log("ProductData",productData);
  console.log("ProvenanceData",provenanceData);
  console.log("ownershipData",ownershipData);
  const { writeContractAsync } = useWriteContract()
  
  const addParticipant = async () => {
    console.log("ParticipantAddress", participantAddress);
    console.log("Adress", address);
    setIsLoading(true)
    try {
      const txHash = await writeContractAsync({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'addParticipant',
        args: [name, pass, participantType , participantAddress],  
      })

      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      })
      // setParticipantId()
      setIsLoading(false)
      toast('Participant added successfully')

      fetchParticipantData();
      setName('');
      setPass('');
      setParticipantAddress('');
      setParticipantType('');
    } catch (error) {
      toast.error('Error while adding participant. Try again.')
      setIsLoading(false)
      console.error(error)
    }
  };
    //Solo podria dar de alta un producto el manufacturer conectado?
  const addProduct = async () => {
    // console.log("Adress", address);
    setIsLoading(true)
    try {
      const txHash = await writeContractAsync({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'addProduct',
        args: [ownerId, modelNumber, partNumber, serialNumber, productCost],  
        //este ownerId es el numero de identificador del fabricante del producto
        //deberia ser el mismo que el del participantId del fabricante
      })
      console.log("TXHASH", txHash);
      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      })

      setIsLoading(false)
      toast('Product added successfully')

      fetchProductData();
      setOwnerId(0);
      setModelNumber('');
      setSerialNumber('');
      setProductCost(0);
    } catch (error) {
      toast.error('Error while adding product. Try again.')
      setIsLoading(false)
      console.error(error)
    }
  };
  const newOwner = async () => {
    setIsLoading(true)
    // if(participantType === "Manufacturer" && pra)
    try {
      const txHash = await writeContractAsync({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'newOwner',
        args: [user1, user2, theProductId],
      })

      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      })

      setIsLoading(false)
      toast('Transfered successfully')

      fetchProvenanceData();
      setUser1(0);
      setUser2(0);
      setTheProductId(0);
    } catch (error) {
      toast.error('Error while transfering. Try again.')
      setIsLoading(false)
      console.error(error)
    }
  };
useEffect(() => {
  // fetchActualOwnerIdData();
  // getParticipants();
  // fetchActualParticipantIdData();
  // fetchActualProductId();
  if (product || provenance){
    setProductData(product);
    setProvenanceData(provenance)
  } 
}, [product, provenance]);

// useEffect(() => {
//   if (productData !== null && productData[1] !== undefined) {
//     // const id = productData[1];
//     // setParticipantId(id); // Actualiza participantId cuando productData cambie
//     fetchParticipantData(); // Refetch cuando cambia participantId

//   }
// }, [productData]);

// useEffect(() => {
//   if (participant) {
//     setParticipantData(participant);
//   }
// }, [participant]);



// console.log("ownerNumber", ownerNumber);
console.log("participant_type", participant_type);
console.log("participantData", participantData);
console.log("productData", productData);

function formatDate(timestamp: bigint) {
  // Convertir el timestamp a un objeto Date
  const date = new Date(parseInt(timestamp.toString()) * 1000); // Multiplicamos por 1000 porque JavaScript espera milisegundos
  
  // Formatear la fecha al estilo preferido (por ejemplo, DD/MM/YYYY HH:mm:ss)
  const formattedDate = date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit'
  });
  
  return formattedDate;
}



  // const getImageClass = (ownerType: any) => {
  //   let imageClass = 'image';

  //   switch (ownerType) {
  //     case 'Manufacturer':
  //       imageClass += ' large image-manufacturer';
  //       break;
  //     case 'Supplier':
  //       imageClass += ' large image-supplier';
  //       break;
  //     case 'Consumer':
  //       imageClass += ' large image-consumer';
  //       break;
  //     default:
  //       break;
  //   }

  //   return imageClass;
  // };

  
// return (
//   <main className="flex min-h-screen flex-col items-center justify-center w-full  my-24">
//     <section className="space-y-5">
//       <h1 className="text-4xl font-bold text-center mt-24">
//         🚀 Publica una Business Card verificada 🚀
//       </h1>
//       <h2 className="text-2xl font-semibold text-center my-36">
//          accesible desde cualquier lugar en internet
//       </h2>
//       <div className="bg-gray-500 w-140 h-120 m-auto m-b-96 flex items-center justify-center rounded-lg" style={{ width: "450px", height: "auto", backgroundColor: '#5e606d' }}>
//         {/* <img src="EducatETH.jpg" alt="Imagen del NFT de EducatETH" className="w-120 h-120 rounded-lg justify-content-center"/> */}
//         <img src="JuanFuente_BusinessCard.png" alt="Imagen del NFT de EducatETH" className="w-full h-auto rounded-lg justify-content-center"/>
//       </div>
//       <div className="p-4 text-xl border border-zinc-700 flex flex-col gap-5 items-center rounded-xl" style={{ backgroundColor: '#131524'}}>
//         <p><span className="font-bold">Identificador de la tarjeta: </span>&nbsp;{CONTRACT_ADDRESS}</p>
//         <p><span className="font-bold">Número del identificador:  </span>&nbsp; 1</p>
//       </div>
//       <div className="p-4 border border-zinc-700 flex flex-col gap-5 items-center rounded-xl" style={{ backgroundColor: '#131524'}}>
//         <ConnectButton showBalance={false} accountStatus={'avatar'} />
//         {!isConnected? (
//           <>
//             <h2>First make sure your wallet is connected</h2>
//           </>
//         ) : (
//           <div className="flex flex-col gap-5 items-center">
//             <p className="text-xl  text-center">
//               {/* 📇 <span className="font-bold">Tu dirección:</span>  {truncateEthAddress(safeAddress)} */}
//               📇 <span className="font-bold">Tu dirección:</span> &nbsp; {safeAddress}
//             </p>
//             <p className="text-xl  text-center">
//               📊 <span className="font-bold">Posees este número de business cards activas: &nbsp;</span>
//               {isLoading? (
//                 <span className="opacity-50">loading...</span>
//               ) : (
//                  data?.toString()
//               )}
//             </p>
//             <button
//               className="py-1 px-3 bg-purple-900 rounded-lg hover:bg-purple-600 scale-105 transition-all disabled:opacity-50 text-xl"
//               onClick={handleMint}
//               disabled={isMinting}
//             >
//               {isMinting? 'Publicando...' : '📤 Publicar Card'}
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="p-4 border border-zinc-700 flex flex-col gap-5 items-center rounded-xl" style={{ backgroundColor: '#131524'}}>
//       <h2 className="text-2xl font-semibold text-center my-4">
//          Enviar Business card a otra dirección
//       </h2>
//       <div className="flex flex-row gap-4">
//         <div className="flex flex-col">
//         <label htmlFor="DestinationAddress">Dirección de destino:</label>
//         <input
//           type="text"
//           placeholder="Dirección de destino"
//           value={destinyAddress}
//           onChange={(e) => setDestinyAddress(e.target.value)}
//           className="border-2 border-stone-800 p-2 rounded-md w-full mb-4 text-base md:text-xl"
//           style={{ backgroundColor: '#5e606d', fontSize: '20px', width: '430px' }}
//           />
//         </div>
//         <div className="flex flex-col">
//         <label htmlFor="amount">Cantidad:</label>
//         <input
//           type="number"
//           placeholder="Amount"
//           min="1" 
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-24 mb-4 text-base md:text-xl"
//           style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
//           />
//         </div>
//         </div>
//         <div>
//         <button
//           className="py-1 px-3 bg-purple-900 text-white rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50 text-xl"
//           onClick={handleTransfer}
//           disabled={isMinting ||!destinyAddress ||!amount}
//         >
//           {isMinting? 'Transfiriendo...' : '📤 Transferir Card'}
//         </button>
//       </div>
//     </div>
//     </section>
//   </main>
// )
  
return (
  // <div className="flex flex-col items-center p-4">
  <div className="flex flex-col flex-center m-auto bg-orange-50 text-stone-800 bg-[url('/logistica_app.png')] bg-no-repeat bg-center bg-contain">
    <ConnectButton />

    <div className="flex flex-col gap-2 m-auto mt-4 w-full max-w-6xl">
      <h1 className="md:text-3xl border-2 border-stone-800 rounded-md w-auto p-2">
        Entrada de datos</h1>

      {/* Sección de entrada de datos del participante */}
      <div></div>
      <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row justify-evenly gap-2">
        {/* <div className="flex flex-col w-full max-w-xs"> */}
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Nombre de proveedor:</label>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base text-stone-800 md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Password:</label>
          <input
            type="text"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>

        </div>
        <div className="flex flex-row gap-2 justify-evenly">

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Cuenta del proveedor:</label>
          <input
            type="text"
            placeholder="Cuenta del proveedor"
            value={participantAddress}
            onChange={(e) => setParticipantAddress(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Tipo de proveedor:</label>
          <input
            type="text"
            placeholder="Tipo de proveedor"
            value={participantType}
            onChange={(e) => setParticipantType(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl"
            style={{ fontSize: '20px' }}
            />
        </div>
        </div>
        </div>
        <div className="content-end">
        <button
          className="py-1 px-3 h-12 w-56 mb-1 bg-orange-500 text-stone-800 rounded-lg hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={addParticipant}
          disabled={isLoading || !name || !pass || !participantAddress || !participantType}
        >
          {isLoading ? 'Añadiendo proveedor...' : '📤 Añadir proveedor'}
        </button>
      </div>
      </div>
      
      {/* Sección de entrada de datos del producto */}
      <div className="flex flex-row justify-between gap-2 w-full">
        {/* <div className="flex flex-row justify-strech w-full gap-4 mb-4 "> */}
        <div className="w-full flex flex-row flex-grow gap-2">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="ownerId">Id del fabricante:</label>
          <input
            type="number"
            placeholder="Número de Id del fabricante"
            value={ownerId}
            min="0"
            onChange={(e) => {setOwnerId(parseInt(e.target.value)); setpartNumber(parseInt(e.target.value))}}
            // className="w-28 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-28 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
            style={{fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label htmlFor="modelNumber">Número de modelo:</label>
          <input
            type="text"
            placeholder="Número del producto"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            className="flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
            style={{ fontSize: '20px' }}
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col flex-grow">
          <label htmlFor="serialNumber">Número de serie:</label>
          <input
            type="text"
            placeholder="Número de serie del producto" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
            style={{fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col max-w-xs">
          {/* <label htmlFor="productCost">Coste del producto:</label> */}
          <label htmlFor="serialNumber">Coste del producto:</label>
          <input
            type="number"
            placeholder="Coste del producto"
            min="0"
            value={productCost}
            onChange={(e) => setProductCost(parseFloat(e.target.value))}
            // className="w-1/3 h-12 mt-6 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-36 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            // className="w-full bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
            style={{ fontSize: '20px' }}
          />
        </div>
        </div>
        <div>
        <button
          className="py-1 px-3 h-12 w-56 mt-6 bg-orange-500 text-stone-800  rounded-lg hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={addProduct}
          disabled={isLoading || !ownerId || !modelNumber || !serialNumber || !productCost}
          >
          {isLoading ? 'Añadiendo producto...' : '📤 Añadir producto'}
        </button>
        </div>
      </div>

      {/* Sección para mover el producto */}
        {/* <div className="flex flex-col flex-grow w-full max-w-xs"> */}
        <div className="flex flex-row gap-2">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="theProductId">Id del producto:</label>
          <input
            type="number"
            placeholder="Número de Id del producto"
            min="0"
            value={theProductId}
            onChange={(e) => setTheProductId(parseInt(e.target.value))}
            className="w-28 h-12 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow">
        <label htmlFor="user1">Mover el producto de este proveedor...</label>
        <input
          type="number"
          placeholder="Número de Id del poseedor actual"
          value={user1}
          min="0"
          onChange={(e) => setUser1(parseInt(e.target.value))}
          className="flex-grow h-12 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
          style={{ fontSize: '20px' }}
        />
        </div>
        <div className="flex flex-col flex-grow ">
          <label htmlFor="user2">...a este proveedor:</label>
          <input
            type="number"
            placeholder="Número de Id del próximo poseedor"
            min="0"
            value={user2}
            onChange={(e) => setUser2(parseInt(e.target.value))}
            // className="py-1 px-3 h-12 flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full text-base md:text-xl"
            className=" flex-grow h-12 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl"
            style={{ fontSize: '20px' }}
          />
        <div>
        </div>
        </div>

        <button
          className="w-56 h-12 mt-7 bg-orange-500 text-stone-800 rounded-lg hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={newOwner}
          disabled={isLoading || !user1 || !user2 || !theProductId}
          >
          {isLoading ? 'Moviendo el producto...' : '📤 Mover el producto'}
        </button>
      </div>

      {/* Mostrar imágenes según el tipo de propietario */}
      <div className="flex flex-row justify-between mt-4 mb-2 w-full border-2 border-stone-800 rounded-md">
        <h1 className="w-auto m-2 md:text-3xl content-center">
          Recuperacion de datos</h1>
        <div className="flex flex-row place-items-center m-2">        
        <p>ID del Producto</p>
        <input
          type="number"
          placeholder="Id del producto"
          min="0"
          value={productId}
          onChange={(e) => {setProductId(parseInt(e.target.value)); setParticipantId(parseInt(e.target.value))}}
          className="bg-orange-100 border-2 border-stone-800 p-2 m-2 rounded-md w-24 text-base md:text-xl"
          style={{ fontSize: '20px' }}
        />
        </div>
      </div>
      <div className="flex justify-around gap-4">
      {/* <p className="flex justify-around mb-8">OWNER Number of product: {ownerNumber || 'No data'}</p> */}
        <p className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full max-w-4xl mb-4 text-base md:text-xl">
          {/* PARTICIPANT NAME : {participant_name || 'No data'}</p> */}
          {/* NOMBRE DEL PROVEEDOR : {participantData ? JSON.stringify(participantData[0]) : 'No data'}</p> */}
          NOMBRE DEL PROVEEDOR : {productData ? JSON.stringify(productData[2]) : 'No data'}</p>
        <p className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full max-w-4xl mb-4 text-base md:text-xl">
          {/* PARTICIPANT TYPE : {participant_type || 'No data'}</p> */}
          {/* TIPO DE PROVEEDOR: {participantData ? JSON.stringify(participantData[1]) : 'No data'}</p> */}
          TIPO DE PROVEEDOR: {productData ? JSON.stringify(productData[3]) : 'No data'}</p>
        {/* <p className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full max-w-4xl mb-4 text-base md:text-xl"> */}
          {/* PARTICIPANT TYPE : {participant_type || 'No data'}</p> */}
          {/* CUENTA DEL PROVEEDOR: {participantData ? JSON.stringify(participantData[2]) : 'No data'}</p> */}
      </div>
      <div className="flex justify-around gap-4 content-center items-center">
        <img
          src="supplychain_manufacturer.png"
          className={`w-52 h-28 rounded-md transform transition-transform duration-300 ${participant_type === '"Manufacturer"' ? 'scale-120 filter-none h-36 border-2 border-stone-800 rounded-md' : ''}`}
          alt="Manufacturer"
        />
        <img
          src="supplychain_supplier1.png"
          className={`w-52 h-28 rounded-md transform transition-transform duration-300 ${participant_type === '"Supplier"' ? 'scale-120 filter hue-rotate-90  h-36 border-2 border-stone-800 rounded-md' : ''}`}
          alt="Supplier"
        />
        <img
          src="supplychain_customer.png"
          className={`w-52 h-28 rounded-md transform transition-transform duration-300 ${participant_type === '"Consumer"' ? 'scale-120 filter hue-rotate-180  h-36 border-2 border-stone-800 rounded-md' : ''}`}
          alt="Consumer"
        />
      </div>
      <div className="flex flex-col justify-center w-full m-auto mt-4 gap-4 ">
      
      <div className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-base md:text-xl">
        Datos del producto: NUMERO - {productData ? productData[0] : 'No data'} &nbsp;|&nbsp;
        Nº DE SERIE - {productData ? productData[1] : 'No data'} &nbsp;|&nbsp;
        COSTE - {productData ? (typeof productData[4] === 'bigint' ? productData[4].toString() : productData[4].toString()) : 'No data'} &nbsp;|&nbsp;
        {/* FECHA DE FABRICACION - {productData ? (typeof productData[5] === 'bigint' ? productData[5].toString() : productData[5].toString()) : 'No data'} &nbsp;|&nbsp; */}
        FECHA DE FABRICACION - {productData ? productData[5]? formatDate(productData[5]) : 'No data' : 'No data'} &nbsp;|&nbsp;
        CUENTA DEL DUEÑO - {productData ? productData[6] : 'No data'}
      </div>
      <div className="flex flex-row bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full mb-2 text-base md:text-xl">
        <h2>Trazabilidad del producto:&nbsp;</h2>
        <div className="flex flex-wrap items-center justify-start">
          <span>TRASFERENCIAS-&nbsp;</span>
          {provenanceData && provenanceData.length > 0 ? (
            <span>
            {provenanceData.map((item: number, index: number) => (
              <span key={index} className="mx-2">
                {item.toString()}
                {index < provenanceData.length - 1 && ', '}
              </span>
            ))}
          </span>
          ) : (
            'No data'
          )}
        </div>
      </div>
      </div>
      {/* <div className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-base md:text-xl">
        Ownership Data: {ownershipData ? JSON.stringify(ownershipData) : 'No data'}
      </div> */}
      <div className="flex flex-col  items-center content-center justify-start  w-full m-auto p-2 m-2 mb-6 rounded-md border-2 border-stone-800">
      {ownershipData && _productId !== 0 && (
      <div className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full  mb-2 text-base md:text-xl">
        Datos de adquisición: ID DE PRODUCTO - {ownershipData ? (typeof ownershipData[0] === 'bigint' ? ownershipData[0].toString() : ownershipData[0].toString()) : 'No data'} &nbsp;|&nbsp;
        ID DEL COMPRADOR - {ownershipData ? (typeof ownershipData[1] === 'bigint' ? ownershipData[1].toString() : ownershipData[1].toString()) : 'No data'} &nbsp;|&nbsp;
        FECHA DE ADQUISICION - {ownershipData ? (typeof ownershipData[3] === 'bigint' ? formatDate(ownershipData[3])  : formatDate(ownershipData[3])) : 'No data'}
      </div>
      )}
      {participantData && participantId !== 0 && (
      <div className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full mb-2 text-base md:text-xl">
        Datos del proveedor: NOMBRE - {participantData ? JSON.stringify(participantData[0]) : 'No data'} &nbsp;|&nbsp;
        TIPO - {participantData ? JSON.stringify(participantData[1]) : 'No data'}  &nbsp;|&nbsp;
        CUENTA - {participantData ? JSON.stringify(participantData[2]) : 'No data'}
      </div>
      )}
    
      {/* Botones para obtener datos de trazabilidad y datos de proveedor */}
      <div className="flex flex-row  place-items-center m-auto gap-4 m-2">
      <div className="flex flex-row  place-items-center gap-4 m-4">        
        <p>ID del Producto</p>
        <input
          type="number"
          placeholder="Id del producto"
          min="0"
          value={_productId}
          onChange={(e) => {set_ProductId(parseInt(e.target.value)); setParticipantId(parseInt(e.target.value))}}
          className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-24 text-base md:text-xl"
          style={{ fontSize: '20px' }}
          />
        {/* <button
          onClick={fetchParticipantData}
          className="py-2 px-3 w-full max-w-48 bg-fuchsia-700 text-white border-2 border-stone-800 p-4 rounded-md hover:bg-fuchsia-900 transition-all disabled:opacity-50 text-xl"
          >
          Datos de proveedor
        </button>

      <button
        onClick={fetchProductData}
        className="py-2 px-3 w-full max-w-48 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-900 transition-all disabled:opacity-50 text-xl"
      >
        Datos de producto
      </button> */}
      <button
        onClick={fetchParticipantData}
        className="py-2 px-3 w-64 bg-orange-500  text-stone-800 rounded-lg hover:bg-orange-400  transition-all disabled:opacity-80 text-xl font-semibold"
        disabled={isLoading || !_productId}
        >
        Datos de proveedor
      </button>
      <button
        onClick={fetchOwnershipData}
        className="py-2 px-3 w-64 bg-orange-500 text-stone-800 rounded-lg hover:bg-orange-400 transition-all disabled:opacity-80 text-xl font-semibold"
        disabled={isLoading || !participantId }
        >
        Transferencias de producto
      </button>
      </div>
      </div>
      </div>
      </div>

    {/* <p className="mt-4">ProductId: {actualProductId}</p>
    <p className="mt-4">ParticipantId: {actualParticipantId}</p> */}
  </div>
);

}
export default App