'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card } from './types';

const CardGenerator = () => {
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const [filterType, setFilterType] = useState('all');
  const [filterElement, setFilterElement] = useState('all');
  const [imageCache, setImageCache] = useState({});
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});

  // Element definitions with enhanced styling
  const elements = {
    fire: {
      name: 'Hỏa',
      icon: '🔥',
      color: 'from-red-600 via-orange-500 to-yellow-400',
      accentColor: 'border-red-500',
      imagePrompt: 'blazing inferno dragon with flames',
      stories: [
        'Tia lửa đầu tiên bùng lên từ viên đá ma thuật cổ xưa.',
        'Ngọn lửa nhỏ lan tỏa, thức tỉnh sức mạnh ngủ quên ngàn năm.',
        'Sinh vật lửa từ núi lửa cổ đại, bảo vệ ngôi đền bị lãng quên.',
        'Lõi lửa rực cháy trong tim người dũng sĩ, sẵn sàng chiến đấu.',
        'Trái tim Phượng Hoàng bất diệt, tái sinh từ tro tàn của chính mình.'
      ],
      effect5: 'Nếu thắng → buộc đối thủ mất thêm 1 thẻ yếu'
    },
    water: {
      name: 'Thủy',
      icon: '🌊',
      color: 'from-blue-600 via-cyan-500 to-blue-400',
      accentColor: 'border-blue-400',
      imagePrompt: 'majestic water elemental spirit in ocean',
      stories: [
        'Giọt nước đơn độc rơi xuống, bắt đầu hành trình về biển cả.',
        'Dòng suối nhỏ chảy qua rừng sâu, mang theo bí mật của núi cao.',
        'Vệ thần nước từ đại dương sâu thẳm, bảo vệ sinh linh biển khơi.',
        'Thủy triều cuồng nộ dâng cao, cuốn trôi mọi kẻ địch.',
        'Leviathan thức giấc sau ngàn năm, chúa tể của bảy đại dương.'
      ],
      effect5: 'Nếu thua → được giữ lại thẻ này (không bị mất)'
    },
    wood: {
      name: 'Mộc',
      icon: '🌱',
      color: 'from-green-600 via-emerald-500 to-green-400',
      accentColor: 'border-green-500',
      imagePrompt: 'ancient forest guardian spirit tree',
      stories: [
        'Hạt giống nảy mầm trong đất, khởi đầu cho một khu rừng mới.',
        'Cây non vươn cao, nhờ ánh mặt trời và mưa đêm.',
        'Cổ thụ ngàn năm, chứng nhân cho biết bao thăng trầm lịch sử.',
        'Tinh linh rừng già thức tỉnh, bảo vệ mảnh đất thiêng liêng.',
        'Thần cây Yggdrasil, nối liền chín cõi giới trong vũ trụ.'
      ],
      effect5: 'Nhân đôi điểm nếu đấu với Lôi'
    },
    earth: {
      name: 'Thổ',
      icon: '⛰️',
      color: 'from-amber-700 via-yellow-600 to-amber-500',
      accentColor: 'border-yellow-600',
      imagePrompt: 'stone golem earth guardian powerful',
      stories: [
        'Viên sỏi nhỏ từ núi cao, mài giũa bởi gió và mưa ngàn năm.',
        'Chiến binh đá kiên cường, không lay chuyển trước mọi thử thách.',
        'Golem cổ đại được tạo ra để bảo vệ thành phố bị lãng quên.',
        'Tảng đá khổng lồ từ lòng đất, chứa đựng sức mạnh nguyên sơ.',
        'Người khổng lồ đất bất diệt, sinh ra từ núi non và đại địa.'
      ],
      effect5: 'Không bị ảnh hưởng bởi thẻ đặc biệt'
    },
    wind: {
      name: 'Phong',
      icon: '🌪️',
      color: 'from-sky-400 via-indigo-400 to-sky-300',
      accentColor: 'border-sky-400',
      imagePrompt: 'wind spirit hurricane tornado sky',
      stories: [
        'Làn gió nhẹ nhàng vuốt ve, mang theo lời thì thầm của thiên nhiên.',
        'Gió sắc bén như dao, cắt đứt mọi ràng buộc và trở ngại.',
        'Diều hâu bay cao giữa cơn bão, chủ nhân của bầu trời.',
        'Cuồng phong sấm sét giáng xuống, trừng phạt kẻ xâm phạm.',
        'Thiên Đế ngự trị trên tầng mây chín, điều khiển mọi làn gió.'
      ],
      effect5: 'Được đổi 1 thẻ đã chọn sau khi lật (một lần/trận)'
    },
    thunder: {
      name: 'Lôi',
      icon: '⚡',
      color: 'from-yellow-500 via-amber-400 to-yellow-300',
      accentColor: 'border-yellow-500',
      imagePrompt: 'lightning dragon thunder storm',
      stories: [
        'Tia chớp đầu tiên xé toạc bầu trời đêm tối.',
        'Sấm rền vang, báo hiệu sự xuất hiện của vị thần giận dữ.',
        'Sư tử sấm sét gầm thét, làm rung chuyển cả núi non.',
        'Búa sét của thần Thor, nghiền nát mọi kẻ thù.',
        'Rồng sấm chín đầu trên trời cao, chủ nhân của mọi tia chớp.'
      ],
      effect5: '+2 sức mạnh nếu trong bộ có thẻ sức 1 đi kèm'
    },
    ice: {
      name: 'Băng',
      icon: '❄️',
      color: 'from-cyan-400 via-blue-300 to-cyan-200',
      accentColor: 'border-cyan-300',
      imagePrompt: 'ice elemental frost snow crystal',
      stories: [
        'Mảnh băng nhỏ li ti bay trong gió tuyết, cô đơn và lạnh lẽo.',
        'Sói tuyết lang thang trong đêm đông giá rét, săn lùng con mồi.',
        'Người khổng lồ băng từ cực Bắc, cơ thể là băng vạn năm.',
        'Vua băng giá trên ngai vàng đóng băng, cai trị vùng đất lạnh.',
        'Độ không tuyệt đối, đóng băng thời gian và không gian.'
      ],
      effect5: 'Giảm 1 điểm sức mạnh của 1 thẻ đối thủ'
    },
    light: {
      name: 'Quang',
      icon: '☀️',
      color: 'from-yellow-200 via-amber-100 to-orange-200',
      accentColor: 'border-yellow-400',
      imagePrompt: 'radiant light angel divine being',
      stories: [
        'Hạt sáng đầu tiên xua tan bóng tối ngàn năm.',
        'Quả cầu sáng huyền bí lơ lửng, chứa đựng ánh sáng thuần khiết.',
        'Thiên sứ với đôi cánh trắng, bảo vệ những tâm hồn trong sáng.',
        'Quầng sáng thiêng liêng chữa lành vết thương và tẩy sạch tội lỗi.',
        'Tổng thiên sứ với sáu đôi cánh, sứ giả của ánh sáng vĩnh cửu.'
      ],
      effect5: 'Tự tăng thêm 1 điểm khi đấu đội Ám'
    },
    dark: {
      name: 'Ám',
      icon: '🌑',
      color: 'from-purple-800 via-gray-900 to-purple-900',
      accentColor: 'border-purple-600',
      imagePrompt: 'dark shadow demon void creature',
      stories: [
        'Bóng tối chập chờn, len lỏi qua từng kẽ hở của ánh sáng.',
        'Kẻ rình rập trong đêm, săn lùng những linh hồn lạc lối.',
        'Dã thú bóng đêm không hình hài, chỉ là ác mộng trong tâm trí.',
        'Người mang hư vô đến, biến mọi thứ thành cát bụi.',
        'Vua của vực thẳm, nơi ánh sáng không bao giờ chạm tới.'
      ],
      effect5: 'Nếu hòa → tính là thắng'
    }
  };

  const specialCardsData = [
    { id: 'SP-01', name: 'Cường Hóa +1', group: 'buff', rarity: 'Common', effect: '+1 sức mạnh cho 1 thẻ. Dùng trước khi lật.', icon: '⚔️', story: 'Thanh kiếm được rèn trong lò lửa linh thiêng, càng đánh càng sắc bén.' },
    { id: 'SP-02', name: 'Siêu Cường Hóa +2', group: 'buff', rarity: 'Rare', effect: '+2 sức mạnh cho 1 thẻ.', icon: '⚔️⚔️', story: 'Phù chú cổ xưa từ phù thủy truyền thuyết, tăng gấp đôi sức mạnh chiến binh.' },
    { id: 'SP-03', name: 'Nhân Đôi Sức Mạnh', group: 'buff', rarity: 'Epic', effect: 'Nhân đôi 1 thẻ bất kỳ. Siêu hiếm!', icon: '✨', story: 'Ảo ảnh của đại pháp sư, tạo ra bản sao hoàn hảo với cùng sức mạnh.' },
    { id: 'SP-04', name: 'Đổi Bài', group: 'control', rarity: 'Uncommon', effect: 'Thay 1 thẻ vừa chọn bằng thẻ khác trước khi lật.', icon: '🔄', story: 'Lá bài định mệnh đảo chiều, cho phép thay đổi tương lai đã định.' },
    { id: 'SP-05', name: 'Phong Ấn', group: 'control', rarity: 'Rare', effect: 'Vô hiệu hóa 1 thẻ đặc biệt của đối thủ trong trận.', icon: '🔒', story: 'Con dấu cổ từ đền thờ bị phong ấn, ngăn chặn mọi ma thuật.' },
    { id: 'SP-06', name: 'Tráo Quyền', group: 'control', rarity: 'Rare', effect: 'Sau khi lật, chọn lại thứ tự tính điểm.', icon: '👑', story: 'Vương miện tạm thời, người đeo được quyền thay đổi luật chơi.' },
    { id: 'SP-07', name: 'Cướp Thẻ Yếu', group: 'control', rarity: 'Uncommon', effect: 'Nếu thắng, lấy thêm 1 thẻ cấp 1-2 của đối thủ.', icon: '🎯', story: 'Móng vuốt của quạ đêm, lấy đi những thứ giá trị nhất.' },
    { id: 'SP-08', name: 'Khiên Bảo Hộ', group: 'control', rarity: 'Rare', effect: 'Nếu thua → không mất vàng (1 lần).', icon: '🛡️', story: 'Chiếc khiên bất khả xâm phạm của hiệp sĩ huyền thoại.' },
    { id: 'SP-09', name: 'Đánh Tráo Vận Mệnh', group: 'chaos', rarity: 'Uncommon', effect: 'BTC tráo ngẫu nhiên 1 thẻ mỗi bên sau khi chọn.', icon: '🎲', story: 'Nữ thần may rủi giở trò đùa, không ai biết số phận sẽ đi về đâu.' },
    { id: 'SP-10', name: 'Gió Đổi Chiều', group: 'chaos', rarity: 'Rare', effect: 'Hai đội bốc bài ngẫu nhiên thay vì chọn thẻ.', icon: '🌀', story: 'Cơn bão hỗn loạn cuốn bay mọi thứ, chỉ số phận quyết định.' },
    { id: 'SP-11', name: 'Quay Ngược Thời Gian', group: 'chaos', rarity: 'Rare', effect: 'Đấu lại 1 lượt (1 thẻ), kết quả thay thế.', icon: '⏰', story: 'Chiếc đồng hồ cát ma thuật, cho phép quay lại một khoảnh khắc.' },
    { id: 'SP-12', name: 'Bùng Nổ Hỗn Loạn', group: 'chaos', rarity: 'Epic', effect: 'Tất cả thẻ = 3 điểm, bất kể số ghi.', icon: '💥', story: 'Vụ nổ ma thuật xóa bỏ mọi quy tắc, tạo ra sân chơi công bằng.' },
    { id: 'SP-13', name: 'Chọn Số Phận', group: 'chaos', rarity: 'Uncommon', effect: 'BTC đặt 3 thẻ úp. Mỗi đội chọn 1 → cộng thêm.', icon: '🎴', story: 'Ba lá bài định mệnh úp ngửa, chọn đúng là sống, sai là chết.' },
    { id: 'SP-14', name: 'Thủ Lĩnh Tối Cao', group: 'legendary', rarity: 'Legendary', effect: 'Chọn 1 thẻ cấp 5 bất kỳ từ bộ bài để dùng ngay. CỰC MẠNH!', icon: '👑✨', story: 'Ngai vàng của chín nguyên tố, người ngồi lên được triệu hồi thần thú tối thượng.' },
    { id: 'SP-15', name: 'Cú Lật Thế Kỷ', group: 'legendary', rarity: 'Legendary', effect: 'Sau khi lật → đổi 1 thẻ của bạn với đối thủ. SIÊU MẠNH!', icon: '⚡👑', story: 'Khoảnh khắc kỳ diệu chỉ xảy ra một lần trong đời, biến thua thành thắng.' }
  ];

  const elementCards = useMemo(() => {
    const cards: Card[] = [];
    Object.keys(elements).forEach(elementKey => {
      const element = elements[elementKey];
      for (let power = 1; power <= 5; power++) {
        cards.push({
          id: `${elementKey.toUpperCase()}-${power}`,
          type: 'element',
          element: elementKey,
          elementName: element.name,
          icon: element.icon,
          color: element.color,
          accentColor: element.accentColor,
          imagePrompt: element.imagePrompt,
          power: power,
          name: `${element.name} Cấp ${power}`,
          rarity: power === 1 ? 'Common' : power === 2 ? 'Uncommon' : power === 3 ? 'Normal' : power === 4 ? 'Rare' : 'Epic',
          story: element.stories[power - 1],
          effect: power === 4 ? getLevel4Effect(elementKey) : power === 5 ? element.effect5 : null
        });
      }
    });
    return cards;
  }, []);

  function getLevel4Effect(element) {
    const effects = {
      fire: '+1 sức mạnh nếu đối thủ dùng Mộc',
      water: 'Vô hiệu hóa 1 thẻ đặc biệt (33% xác suất)',
      wind: 'Được xem thẻ của đối thủ trước 1 giây',
      wood: '+1 sức mạnh khi đấu với Thủy',
      earth: 'Giảm 50% thiệt hại nếu thua',
      thunder: '+1 khi có thẻ Phong trong bộ',
      ice: 'Làm chậm hiệu ứng thẻ đặc biệt đối thủ',
      light: 'Phục hồi 1 vàng khi thắng',
      dark: '+1 sức mạnh vào ban đêm (sau 18h)'
    };
    return effects[element];
  }

  const allCards = [
    ...elementCards.map(c => ({ ...c, cardType: 'element' })),
    ...specialCardsData.map(c => ({ ...c, cardType: 'special' }))
  ];

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      if (filterType !== 'all' && card.cardType !== filterType) return false;
      if (filterElement !== 'all' && card.element !== filterElement) return false;
      return true;
    });
  }, [filterType, filterElement, allCards]);

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'from-slate-600 to-slate-500',
      'Uncommon': 'from-emerald-600 to-green-500',
      'Normal': 'from-cyan-600 to-blue-500',
      'Rare': 'from-purple-600 to-indigo-500',
      'Epic': 'from-orange-600 to-red-500',
      'Legendary': 'from-yellow-400 via-orange-500 to-red-500'
    };
    return colors[rarity] || 'bg-gray-400';
  };

  const getRarityTextColor = (rarity) => {
    return rarity === 'Legendary' ? 'text-yellow-300' : 'text-white';
  };

  const imageUrls = useMemo(() => {
    const urls = {};
    elementCards.forEach(card => {
      const cacheKey = `${card.element}-${card.power}`;
      urls[cacheKey] = `/placeholder.svg?height=280&width=200&query=${encodeURIComponent(card.imagePrompt)} level ${card.power} mystical trading card art`;
    });
    return urls;
  }, [elementCards]);

  const getCardImage = (elementKey, power, cardId) => {
    // Ưu tiên ảnh đã upload
    if (uploadedImages[cardId]) {
      return uploadedImages[cardId];
    }
    const cacheKey = `${elementKey}-${power}`;
    return imageUrls[cacheKey] || "/placeholder.svg";
  };

  const handleImageUpload = (cardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImages(prev => ({
          ...prev,
          [cardId]: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Download feature removed

  const ElementCard = ({ card }) => (
    <div className="group">
      {/* Using aspect ratio 88mm/63mm = 1.397 */}
      <div 
        style={{
          width: '252px', // 63mm at 96dpi
          height: '352px', // 88mm at 96dpi
          aspectRatio: '63/88'
        }}
        className="flex flex-col"
      >
        <div 
          id={`card-${card.id}`}
          className={`relative h-full bg-gradient-to-br ${card.color} rounded-2xl p-0.5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className={`${card.element === 'light' ? 'bg-gradient-to-b from-gray-100 to-gray-50' : 'bg-gradient-to-b from-gray-50 to-white'} rounded-2xl p-3 h-full flex flex-col gap-1.5`}>
            {/* Header - Name only */}
            <div className={`border-b-2 ${card.accentColor} pb-1.5 flex-shrink-0`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-grenze text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Thẻ Nguyên Tố</div>
                  <h3 className="font-grenze font-bold text-sm leading-tight text-gray-900 mt-0.5">{card.name}</h3>
                  <div className="font-texturina text-[10px] uppercase text-gray-700 font-semibold mt-1">{card.icon} {card.elementName}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <div className={`bg-gradient-to-r ${getRarityColor(card.rarity)} ${getRarityTextColor(card.rarity)} text-[8px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap`}>
                    {card.rarity}
                  </div>
                  <div className="text-red-600 font-bold text-lg leading-none">{card.power}</div>
                </div>
              </div>
            </div>
            
            <div className={`bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center border-2 ${card.accentColor} shadow-lg overflow-hidden relative group/img flex-shrink-0`}
              style={{ height: '120px' }}
            >
              <img 
                src={getCardImage(card.element, card.power, card.id) || "/placeholder.jpg"}
                alt={card.name}
                className="w-full h-full object-cover opacity-85 group-hover/img:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none"></div>
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg">
                  📷 Tải ảnh
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(card.id, e)}
                  />
                </label>
              </div>
            </div>
            
            {/* Story */}
            <div className={`bg-gradient-to-r ${card.color} rounded-lg p-1.5 flex-shrink-0`}>
              <p className={`font-texturina text-[11px] italic font-medium leading-snug line-clamp-2 ${
                card.element === 'light' 
                  ? 'text-gray-900' 
                  : 'text-white/95'
              }`}>{card.story}</p>
            </div>
            
            {/* Effect if present */}
            {card.effect && (
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-1.5 border-yellow-400 rounded-lg p-1.5 flex-shrink-0">
                <div className="text-[9px] font-bold text-yellow-900 mb-0.5">
                  {card.power === 4 ? '⚡ CẤP 4' : '✨ CẤP 5'}
                </div>
                <p className="font-texturina text-[10px] font-semibold text-gray-800 leading-snug line-clamp-2">{card.effect}</p>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-1 text-center text-[9px] font-bold border-t border-gray-200 pt-1 mt-auto flex-shrink-0">
              <div className="bg-red-50 rounded py-0.5">
                <div className="font-texturina text-gray-600 text-[8px]">SỨC MẠNH</div>
                <div className="text-red-600 font-bold text-xs">{card.power}</div>
              </div>
              <div className="bg-purple-50 rounded py-0.5">
                <div className="font-texturina text-gray-600 text-[8px]">NGUYÊN TỐ</div>
                <div className="font-texturina text-purple-600 font-bold text-[9px]">{card.elementName}</div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="font-texturina text-center text-[8px] text-gray-500 italic border-t border-gray-200 pt-1 flex-shrink-0 flex items-center justify-center gap-2">
              <span>{card.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SpecialCard = ({ card }) => {
    const groupColors = {
      'buff': 'from-green-600 via-emerald-500 to-green-400',
      'control': 'from-blue-600 via-indigo-500 to-purple-400',
      'chaos': 'from-purple-600 via-pink-500 to-red-400',
      'legendary': 'from-yellow-500 via-orange-500 to-red-500'
    };

    const groupBorderColor = {
      'buff': 'border-green-500',
      'control': 'border-indigo-500',
      'chaos': 'border-pink-500',
      'legendary': 'border-yellow-400'
    };

    return (
      <div className="group">
        <div 
          style={{
            width: '252px', // 63mm at 96dpi
            height: '352px', // 88mm at 96dpi
            aspectRatio: '63/88'
          }}
          className="flex flex-col"
        >
          <div 
            id={`card-${card.id}`}
            className={`relative h-full bg-gradient-to-br ${groupColors[card.group]} rounded-2xl p-0.5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-3 h-full flex flex-col gap-1.5">
              {/* Header */}
              <div className={`border-b-2 ${groupBorderColor[card.group]} pb-1.5 flex-shrink-0`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-grenze text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Thẻ Đặc Biệt</div>
                    <h3 className="font-grenze font-bold text-sm leading-tight text-gray-900 mt-0.5">{card.name}</h3>
                  </div>
                  <div className={`bg-gradient-to-r ${getRarityColor(card.rarity)} ${getRarityTextColor(card.rarity)} text-[8px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap flex-shrink-0`}>
                    {card.rarity}
                  </div>
                </div>
              </div>
              
              <div className={`bg-gradient-to-br ${groupColors[card.group]} h-32 rounded-lg flex items-center justify-center border-2 ${groupBorderColor[card.group]} shadow-lg flex-shrink-0 relative group/img overflow-hidden`}>
                {uploadedImages[card.id] ? (
                  <img 
                    src={uploadedImages[card.id]}
                    alt={card.name}
                    className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="text-5xl drop-shadow-lg">{card.icon}</div>
                )}
                
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg">
                    📷 Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(card.id, e)}
                    />
                  </label>
                </div>
              </div>
              
              {/* Story */}
              <div className={`bg-gradient-to-r ${groupColors[card.group]} rounded-lg p-1.5 flex-shrink-0`}>
                <p className="font-texturina text-[11px] italic font-medium text-white/95 leading-snug line-clamp-2">{card.story}</p>
              </div>
              
              {/* Effect */}
              <div className={`bg-gradient-to-r ${
                card.group === 'legendary' 
                  ? 'from-yellow-100 to-orange-100 border-yellow-400' 
                  : 'from-blue-100 to-purple-100 border-purple-400'
              } rounded-lg p-1.5 border-1.5 flex-shrink-0`}>
                <div className="font-grenze text-[9px] font-bold text-purple-900 mb-0.5">HIỆU ỨNG:</div>
                <p className="font-texturina text-[10px] font-semibold text-gray-800 leading-snug line-clamp-2">{card.effect}</p>
              </div>
              
              {/* Footer */}
              <div className="font-texturina text-center text-[8px] text-gray-500 italic border-t border-gray-200 pt-1 flex-shrink-0 mt-auto flex items-center justify-center gap-2">
                <span>{card.id} • ... vàng</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <h1 className="font-grenze text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mb-2">
            🏆 THỦ LĨNH THẺ BÀI 🏆
          </h1>
          <p className="font-texturina text-lg md:text-xl text-purple-200">Hành Trình Kho Báu 9 Nguyên Tố</p>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <span className="font-texturina text-sm text-purple-300">🔥 🌊 🌱 ⛰️ 🌪️ ⚡ ❄️ ☀️ 🌑</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-texturina text-gray-00 text-sm font-bold mb-2 block">Loại thẻ:</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="font-texturina w-full bg-gray-800/50 backdrop-blur border-2 border-purple-400/50 text-white rounded-lg px-3 py-2 font-bold hover:border-purple-400 transition"
              >
                <option value="all" className="bg-gray-800">Tất cả ({allCards.length})</option>
                <option value="element" className="bg-gray-800">Thẻ Nguyên Tố (45)</option>
                <option value="special" className="bg-gray-800">Thẻ Đặc Biệt (15)</option>
              </select>
            </div>

            <div>
              <label className="font-texturina text-gray-00 text-sm font-bold mb-2 block">Nguyên tố:</label>
              <select 
                value={filterElement}
                onChange={(e) => setFilterElement(e.target.value)}
                className="font-texturina w-full bg-gray-800/50 backdrop-blur border-2 border-purple-400/50 text-white rounded-lg px-3 py-2 font-bold hover:border-purple-400 transition disabled:opacity-50"
                disabled={filterType === 'special'}
              >
                <option value="all" className="bg-gray-800">Tất cả</option>
                {Object.entries(elements).map(([key, val]) => (
                  <option key={key} value={key} className="bg-gray-800">{val.icon} {val.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-texturina text-gray-00 text-sm font-bold mb-2 block">Hiển thị:</label>
              <div className="flex gap-2">
                {[3, 4, 5].map(num => (
                  <button 
                    key={num}
                    onClick={() => setCardsPerRow(num)}
                    className={`flex-1 px-3 py-2 rounded-lg font-bold transition ${
                      cardsPerRow === num 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                        : 'bg-gray-800/50 text-gray-00 hover:bg-gray-700/50 border border-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid gap-6 ${
          cardsPerRow === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          cardsPerRow === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {filteredCards.map((card) => 
            card.cardType === 'element' ? 
              <ElementCard key={card.id} card={card} /> :
              <SpecialCard key={card.id} card={card} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 shadow-lg border border-purple-500/20">
          <p className="font-grenze font-bold text-white">© 2025 Thủ Lĩnh Thẻ Bài</p>
          <p className="font-texturina text-sm text-gray-400 mt-2">Tổng: {allCards.length} thẻ • Hiển thị: {filteredCards.length} thẻ</p>
          <p className="font-texturina text-xs text-gray-500 mt-2">Mỗi thẻ đều có một câu chuyện riêng 📖</p>
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;
