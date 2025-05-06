import React from 'react';
import './RoomSystem_Lecturer.css';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/*Input test*/
const rooms = Array(6).fill({
    id: '401B4',
    building: 'B4',
    floor: 4,
    capacity: 30,
    presence: 0,
    scheduled: '02/05/2025, 09:00 - 10:50',
    devices: {
      fans: 'On',
      lights: 'On',
      projector: 'Off',
      door: 'Close',
    },
    status: 'Available',
  });
  
  /*test*/
  rooms[4].devices.fans = 'On';
  rooms[4].status = 'In use';
  rooms[4].devices.projector = 'Off';
  rooms[4].devices.door = 'Close';

  export default function RoomSystem_Lecturer() {

    const [selectedTab, setSelectedTab] = useState<'All' | 'Available' | 'Booked'>('All');

    const handleTabClick = (tab: 'All' | 'Available' | 'Booked') => {
        setSelectedTab(tab);
      };

    return (
      <div className="d-flex">
        <aside className="bg-light p-4" style={{ width: '200px', height: '100vh' }}>
          <div className="fw-bold mb-4">🏠 ROMS</div>
          <ul className="nav flex-column">
            <li className="nav-item my-2 d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door-fill m-1" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                </svg>
                <a href="#" className='text-decoration-none text-reset'>
                  <p className='m-0'>Home</p>
                </a>
            </li>
            <li className="nav-item my-2 d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save2-fill m-1" viewBox="0 0 16 16">
                    <path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v6h-2a.5.5 0 0 0-.354.854l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5A.5.5 0 0 0 10.5 7.5h-2z"/>
                </svg>
                <a href="#" className='text-decoration-none text-reset'>
                  <p className='m-0'>Bookings</p>
                </a>
            </li>
            <li className="nav-item my-2 d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill m-1" viewBox="0 0 16 16">
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                </svg>
                <a href="#" className='text-decoration-none text-reset'>
                  <p className='m-0'>Contact</p>
                </a>
            </li>
            <hr className='m-0'/>
            <li className="nav-item my-2 d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-wide-connected m-1" viewBox="0 0 16 16">
                    <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
                </svg>
                <a href="#" className='text-decoration-none text-reset'>
                  <p className='m-0'>My account</p>
                </a>
            </li>
          </ul>
        </aside>
  
        <main className="flex-grow-1 p-4">
  
          <section>
            <h2>SCAMS &gt; ROMS</h2>

            <div className='d-flex justify-content-between mb-3'>
                <div className="d-flex gap-4 fw-bold my-2">
                    <span
                    className={selectedTab === 'All' ? 'text-warning border-bottom border-warning border-2' : 'text-secondary'}
                    onClick={() => handleTabClick('All')}
                    style={{ cursor: 'pointer' }}
                    >
                    All Rooms (496)
                    </span>
                    <span
                    className={selectedTab === 'Available' ? 'text-warning border-bottom border-warning border-2' : 'text-secondary'}
                    onClick={() => handleTabClick('Available')}
                    style={{ cursor: 'pointer' }}
                    >
                    Available Rooms (293)
                    </span>
                    <span
                    className={selectedTab === 'Booked' ? 'text-warning border-bottom border-warning border-2' : 'text-secondary'}
                    onClick={() => handleTabClick('Booked')}
                    style={{ cursor: 'pointer' }}
                    >
                    Booked Rooms (62)
                    </span>
                </div>

                <div className="">
                    <select className="form-select border-2">
                        <option value="all">Filter</option>
                        <option value="1">Sort by 1</option>
                        <option value="2">Sort by 2</option>
                        <option value="3">Sort by 3</option>
                    </select>
                </div>
            </div>

            
  

            <div className="table-responsive border border-2 rounded">

                <div className='d-flex justify-content-between p-2 m-2'>
                    <div>
                        <h5 className='m-1'>All rooms</h5>
                    </div>

                    <form action="">
                        <input className="form-control border-2" id="search-input" placeholder="Search rooms" type="text" />
                    </form>
                </div>

              <table className="table">
                <thead className="table-light">
                  <tr>
                    <th className=''><input className='form-check-input' type="checkbox" name="" value=""/></th>
                    <th>Room ID</th>
                    <th>Buildings</th>
                    <th>Floor</th>
                    <th>Capacity</th>
                    <th>Human Presence</th>
                    <th>Next Scheduled</th>
                    <th>Devices Status</th>
                    <th>Current Status</th>
                    <th>Booking Option</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr key={index}>
                      <td className='align-middle'><input className='form-check-input border-2' type="checkbox" name='' value=""/></td>
                      <td className='align-middle'>{room.id}</td>
                      <td className='align-middle'>{room.building}</td>
                      <td className='align-middle'>{room.floor}</td>
                    <td className='align-middle'>
                        <div className="my-2 d-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people-fill p-1" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                            </svg>
                            <p className='m-0'>{room.capacity}</p>
                        </div>
                    </td>
                    
                      <td className='align-middle'>
                        <div className="my-2 d-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people-fill p-1" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                            </svg>
                            <p className='m-0'>{room.presence}</p>
                        </div>
                      </td>

                      <td className='align-middle'>
                        <div className='my-2 d-flex'>
                            <p className='m-0'>{room.scheduled}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar-check p-1" viewBox="0 0 16 16">
                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                            </svg>
                        </div>
                    </td>


                      <td>
                        Fans: <span className="badge bg-success me-1">{room.devices.fans}</span>
                        <br/>
                        Lights: <span className="badge bg-success me-1">{room.devices.lights}</span>
                        <br/>
                        Projector: <span className={`badge ${room.devices.projector === 'On' ? 'bg-success' : 'bg-danger'} me-1`}>{room.devices.projector}</span>
                        <br/>
                        Door: <span className={`badge ${room.devices.door === 'Open' ? 'bg-primary' : 'bg-danger'}`}>{room.devices.door}</span>
                      </td>
                      <td className='text-center align-middle'>
                        <span className={`badge rounded-pill p-2 ${room.status === 'Available' ? 'bg-success' : 'bg-primary'}`}>{room.status}</span>
                      </td>
                      <td className='text-center align-middle'>
                        <button className="btn btn-success btn-sm rounded-pill p-2">Book now</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

                <div className="d-flex justify-content-between align-items-center p-3 mx-3">
                    <div>
                        <span>1 - 10</span>
                        <span>/</span>
                        <span>100</span>
                    </div>

                    <div className='d-flex'>
                        <div>
                            <p className='m-2'>Records per page</p>
                        </div>
                        <div>
                            <select className="form-select border-2 m-1">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <ul className="pagination rounded-pill">
                            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
                    </div>
                </div>

            </div>
  
            
          </section>
        </main>
      </div>
    );
  }