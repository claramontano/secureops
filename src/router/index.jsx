import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import SiemDashboard from '../pages/SiemDashboard/SiemDashboard'
import IncidentResponse from '../pages/IncidentResponse/IncidentResponse'
import VulnManager from '../pages/VulnManager/VulnManager'
import GrcManager from '../pages/GrcManager/GrcManager'
import IamSimulator from '../pages/IamSimulator/IamSimulator'
import PhishDetect from '../pages/PhishDetect/PhishDetect'
import CipherLab from '../pages/CipherLab/CipherLab'
import Vault from '../pages/Vault/Vault'
import NetworkAnalyzer from '../pages/NetworkAnalyzer/NetworkAnalyzer'
import MitreExplorer from '../pages/MitreExplorer/MitreExplorer'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'siem', element: <SiemDashboard /> },
            { path: 'incidents', element: <IncidentResponse /> },
            { path: 'vulns', element: <VulnManager /> },
            { path: 'grc', element: <GrcManager /> },
            { path: 'iam', element: <IamSimulator /> },
            { path: 'phish', element: <PhishDetect /> },
            { path: 'cipher', element: <CipherLab /> },
            { path: 'vault', element: <Vault /> },
            { path: 'network', element: <NetworkAnalyzer /> },
            { path: 'mitre', element: <MitreExplorer /> },
        ]
    }
])