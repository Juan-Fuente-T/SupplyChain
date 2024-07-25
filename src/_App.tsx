import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS } from './constants'
import { abi } from './assets/abis/supplychain.ts'
import { useEffect, useState } from 'react'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from './main'
import { toast } from 'react-toastify'
import { isAddress } from 'viem/utils'; 
// import truncateEthAddress from 'truncate-eth-address';


function App(): JSX.Element {
  const { address, isConnected } = useAccount();
  // const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [destinyAddress, setDestinyAddress] = useState("");
  const [amount, setAmount] = useState(1);
  const safeAddress = address?? 'Please, connect your wallet'; // Se utiliza este string como placeholder
  const [name, setName] = useState('');
  const [pass, SetPass] = useState('');//Mejorar esto, asegurar, guardar, etc
  const [participantAddress, setParticipantAddress] = useState('');//Mejorar esto, asegurar, guardar, etc
  const [participantType, setParticipantType] = useState('');
  const [participantId, setParticipantId] = useState(0);//Esta bien como cero???
  const [productId, setProductId] = useState(0);
  const [ownerId, setOwnerId] = useState(0);//deberia ser la address conectada si solo puede dar de alta producto un manufacturer conectado
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [productCost, setProductCost] = useState('');
  const [participantNumber, setParticipantNumber] = useState(0);
  const [user1, setUser1] = useState(0);
  const [user2, setUser2] = useState(0);
  const [theProductId, setTheProductId] = useState(0);


  // Estados para almacenar los datos leídos del contrato
  const [participantData, setParticipantData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [provenanceData, setProvenanceData] = useState<any>(null);
  const [ownershipData, setOwnershipData] = useState<any>(null);


  // const { data, isLoading, refetch } = useReadContract({
  const { data: participant, refetch: refetchParticipant } = useReadContract({
  // const { participant, refetch } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getParticipant',
    args: [participantId],
  });
  // const { data, refetch } = useReadContract({
    const { data: product, refetch: refetchProduct } = useReadContract({    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getProduct',
    args: [productId],
  });
  // const { data, refetch } = useReadContract({
    const { data: provenance, refetch: refetchProvenance } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getProvenance',
    args: [productId],
  });
  // const { data, refetch } = useReadContract({
    const { data: ownership, refetch: refetchOwnership } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getOwnership',
    args: [productId],
  });

  const fetchParticipantData = async () => {
    const result = await refetchParticipant();
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

  const { writeContractAsync } = useWriteContract()

  const addParticiant = async () => {
    console.log("SaveAdress", safeAddress);
    console.log("Adress", address);
    setIsLoading(true)
    try {
      const txHash = await writeContractAsync({
        abi,
        address: CONTRACT_ADDRESS,
        functionName: 'addParticipant',
        args: [name, pass, participantAddress, participantType],  
      })

      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      })

      setIsLoading(false)
      toast('Participant added successfully')

      // refetch()
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
        functionName: 'addParticipant',
        args: [ownerId, modelNumber, participantNumber, serialNumber, productCost],  
        //este ownerId deberia ser la address conectada??
      })

      await waitForTransactionReceipt(config, {
        confirmations: 1,
        hash: txHash,
      })

      setIsLoading(false)
      toast('Product added successfully')

      // refetch()
    } catch (error) {
      toast.error('Error while adding product. Try again.')
      setIsLoading(false)
      console.error(error)
    }
};
  const newOwner = async () => {
    setIsLoading(true)
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
      toast('Minted successfully')

      // refetch()
    } catch (error) {
      toast.error('Error while minting. Try again.')
      setIsLoading(false)
      console.error(error)
    }
  };

  useEffect(() => {
    if (product) setProductData(product);
  }, [product]);

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
//           className="border-2 border-gray-300 p-2 rounded-md w-full mb-4 text-base md:text-xl"
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
//           className="bg-gray-800 border-2 border-gray-300 p-2 rounded-md w-24 mb-4 text-base md:text-xl"
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
  <div>
    <ConnectButton />
    <div>
      {/* Botones para obtener datos del contrato */}
      <button onClick={fetchParticipantData}>Fetch Participant Data</button>
      <button onClick={fetchProductData}>Fetch Product Data</button>
      <button onClick={fetchProvenanceData}>Fetch Provenance Data</button>
      <button onClick={fetchOwnershipData}>Fetch Ownership Data</button>

      {/* Mostrar datos leídos del contrato */}
      <div>Participant Data: {participantData ? JSON.stringify(participantData) : 'No data'}</div>
      <div>Product Data: {productData ? JSON.stringify(productData) : 'No data'}</div>
      <div>Provenance Data: {provenanceData ? JSON.stringify(provenanceData) : 'No data'}</div>
      <div>Ownership Data: {ownershipData ? JSON.stringify(ownershipData) : 'No data'}</div>
    </div>
    {/* Implementar el resto de la UI y la lógica aquí */}
  </div>
);
}
export default App