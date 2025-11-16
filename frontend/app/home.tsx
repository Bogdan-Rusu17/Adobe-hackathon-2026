// Home.tsx
import React, {useEffect, useMemo, useState, useRef } from "react";
import {
  View, Text, StyleSheet, Dimensions, Image, ScrollView,
  TouchableOpacity, StatusBar, PanResponder,
} from "react-native";
import Timy from "../src/assets/timyChat.png";
import MenuIcon from "../src/assets/burger.png";
import BellIcon from "../src/assets/bell.png";
import UserIcon from "../src/assets/profile.png";
import { Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import {getJWT} from "../src/storage/authStorage";

const router = useRouter();

const C = {
  bg: "#FFF8EA",
  navy: "#002150",
  text: "#334155",
  muted: "#64748B",
  pill: "#EDEBE4",
  blue: "#5884BB",
  cardGrey: "#BFC9D8",
  cardBlue: "#6E8FBE",
  white: "#FFFFFF",
};

const dayLetters = ["m","t","w","t","f","s","s"];
const weekdayHeaders = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// Tipurile de date pentru backend
interface Attendee {
  name: string;
  email: string;
  avatarUrl?: string;  // URL-ul imaginii de profil sau undefined pentru placeholder
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;  // ISO string sau format de tip "2024-01-15T12:00:00"
  endTime: string;
  location?: string;
  attendees: Attendee[];
  color?: string;  // optional, se poate decide în funcție de tip sau status
}

const ordinal = (n:number)=>{
  const j=n%10,k=n%100;
  if(j===1&&k!==11) return `${n}st`;
  if(j===2&&k!==12) return `${n}nd`;
  if(j===3&&k!==13) return `${n}rd`;
  return `${n}th`;
};

function getWeekFromDate(anchor: Date){
  const base=new Date(anchor); base.setHours(0,0,0,0);
  const dow=base.getDay(); const mondayOffset=(dow+6)%7;
  const monday=new Date(base); monday.setDate(base.getDate()-mondayOffset);
  return Array.from({length:7},(_,i)=>{const d=new Date(monday); d.setDate(monday.getDate()+i); return d;});
}

function getMonthMatrix(anchor: Date){
  const y=anchor.getFullYear(), m=anchor.getMonth();
  const first=new Date(y,m,1), last=new Date(y,m+1,0);
  const firstDow=(first.getDay()+6)%7;
  const daysInMonth=last.getDate();
  const prev=firstDow;
  const totalCells=prev+daysInMonth;
  const trailing=(7-(totalCells%7))%7;
  const total=totalCells+trailing;
  const start=new Date(y,m,1); start.setDate(1-prev);
  const cells=Array.from({length:total},(_,i)=>{
    const d=new Date(start);
    d.setDate(start.getDate()+i);
    return {date:d,isCurrentMonth:d.getMonth()===m};
  });
  const weeks=[] as {date:Date;isCurrentMonth:boolean}[][];
  for(let i=0;i<total;i+=7) weeks.push(cells.slice(i,i+7));
  return weeks;
}

/** ============ CalendarExpandable ============ */
function CalendarExpandable({
                              selectedDate, onSelect,
                            }: { selectedDate: Date; onSelect: (d:Date)=>void }) {
  const [expanded,setExpanded]=useState(false);
  const [stripH,setStripH]=useState(0);
  const [monthH,setMonthH]=useState(0);
  const anim=useMemo(()=>new Animated.Value(0),[]);

  // Luna curentă pentru month view (poate fi navigată)
  const [currentMonth, setCurrentMonth] = useState(()=>{const t=new Date(); t.setHours(0,0,0,0); return t;});
  const today=useMemo(()=>{const t=new Date(); t.setHours(0,0,0,0); return t;},[]);

  // Week strip bazat pe selectedDate, month grid bazat pe currentMonth
  const weekDates=useMemo(()=>getWeekFromDate(selectedDate),[selectedDate]);
  const monthWeeks=useMemo(()=>getMonthMatrix(currentMonth),[currentMonth]);

  // Navigare luna
  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const height=anim.interpolate({
    inputRange:[0,1],
    outputRange:[Math.max(stripH,1), Math.max(monthH,1)],
    extrapolate:"clamp"
  });
  const weekOpacity=anim.interpolate({ inputRange:[0,0.4], outputRange:[1,0], extrapolate:"clamp" });
  const monthOpacity=anim.interpolate({ inputRange:[0.6,1], outputRange:[0,1], extrapolate:"clamp" });
  const monthTranslate=anim.interpolate({ inputRange:[0,1], outputRange:[-10,0] });

  const toggle=()=>{
    const newExpanded = !expanded;
    Animated.timing(anim,{
      toValue: newExpanded ? 1 : 0,
      duration:300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver:false
    }).start();
    setExpanded(newExpanded);
  };

  // Funcție pentru a verifica dacă data este selectată
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
  };

    useEffect(() => {
        const checkAuth = async () => {
        const token = await getJWT();
        if (token === null) {
            router.replace('/');
        }
        };
        checkAuth();
    }, []);

  return (
      <Animated.View style={[cal.pillWrap,{height}]}>
        <TouchableOpacity style={cal.pillInner} onPress={toggle} activeOpacity={0.9}>
          {/* STRIP (week) */}
          <Animated.View
              style={[cal.weekRow,{opacity:weekOpacity, position:"absolute", left:0, right:0, top:16}]}
              onLayout={(e)=>setStripH(e.nativeEvent.layout.height+32)}
              pointerEvents={expanded ? "none" : "auto"}
          >
            <View style={cal.weekInner}>
              {weekDates.map((d,i)=>{
                const isSel = isSameDay(d, selectedDate);
                const isToday = isSameDay(d, today);
                const n=String(d.getDate()).padStart(2,"0");
                return (
                    <TouchableOpacity
                        key={i}
                        style={cal.dayCol}
                        activeOpacity={0.7}
                        onPress={(e)=>{
                          e.stopPropagation();
                          onSelect(d);
                        }}
                    >
                      <Text style={[cal.dayLabel,isSel&&{color:C.navy}]}>{dayLetters[i]}</Text>
                      <View style={[
                        cal.dot,
                        isSel && cal.dotSel,
                        isToday && !isSel && { borderWidth: 2, borderColor: C.blue }
                      ]}>
                        <Text style={[cal.dotText,isSel&&{color:C.white,fontWeight:"700"}]}>{n}</Text>
                      </View>
                    </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* MONTH (grid) */}
          <Animated.View
              style={{
                opacity:monthOpacity,
                transform:[{translateY:monthTranslate}],
                position: expanded ? "relative" : "absolute"
              }}
              onLayout={(e)=>setMonthH(e.nativeEvent.layout.height+24)}
              pointerEvents={expanded ? "auto" : "none"}
          >
            {/* Header cu lunile */}
            <View style={cal.monthTitleRow}>
              <TouchableOpacity onPress={goToPrevMonth} style={cal.arrowButton}>
                <Text style={cal.arrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={cal.monthTitle}>
                {new Intl.DateTimeFormat("en-US",{month:"long", year:"numeric"}).format(currentMonth)}
              </Text>
              <TouchableOpacity onPress={goToNextMonth} style={cal.arrowButton}>
                <Text style={cal.arrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Header zile săptămână */}
            <View style={cal.monthHeaderRow}>
              {weekdayHeaders.map(h=><Text key={h} style={cal.monthHeaderCell}>{h}</Text>)}
            </View>

            {monthWeeks.map((w,wi)=>(
                <View key={wi} style={cal.monthWeekRow}>
                  {w.map(({date,isCurrentMonth},di)=>{
                    const isSel = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);

                    return (
                        <TouchableOpacity
                            key={di}
                            style={cal.monthCell}
                            activeOpacity={0.7}
                            onPress={(e)=>{
                              e.stopPropagation();
                              onSelect(new Date(date));
                            }}
                        >
                          <View style={[
                            cal.monthDot,
                            (isSel || isToday) && cal.monthDotBase,
                            isToday && !isSel && { borderColor:C.blue, borderWidth:2 },
                            isSel && { backgroundColor:C.blue }
                          ]}>
                            <Text style={[
                              cal.monthDotText,
                              !isCurrentMonth && { opacity:0.35 },
                              isSel && { color:C.white, fontWeight:"700" }
                            ]}>
                              {String(date.getDate()).padStart(2,"0")}
                            </Text>
                          </View>
                        </TouchableOpacity>
                    );
                  })}
                </View>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
  );
}

/** ===================== Home page ===================== */
export default function Home(){
  const router = useRouter();
  const { width: W, height: H } = Dimensions.get("window");

  const [selectedDate,setSelectedDate]=useState(()=>{const t=new Date(); t.setHours(0,0,0,0); return t;});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Funcție pentru a încărca evenimentele din backend
  const loadEvents = async (date: Date) => {
    setLoading(true);
    try {
      // TODO: Înlocuiește cu endpoint-ul tău real
      // const response = await fetch(`YOUR_API_URL/events?date=${date.toISOString()}`);
      // const data = await response.json();
      // setEvents(data);

      // MOCK DATA - șterge după ce implementezi backend-ul
      const mockEvents: CalendarEvent[] = [
        {
          id: "1",
          title: "Team Meeting",
          startTime: "2024-01-15T12:00:00",
          endTime: "2024-01-15T13:20:00",
          location: "Bucharest Office",
          attendees: [
            { name: "Mihaela Pop", email: "mihaela@example.com" },
            { name: "Ion Popescu", email: "ion@example.com" },
            { name: "Ana Maria", email: "ana@example.com" },
          ],
          color: C.cardGrey
        },
        {
          id: "2",
          title: "Client Presentation",
          startTime: "2024-01-15T15:00:00",
          endTime: "2024-01-15T16:30:00",
          location: "Online - Zoom",
          attendees: [
            { name: "John Doe", email: "john@client.com" },
            { name: "Sarah Smith", email: "sarah@client.com" },
          ],
          color: C.cardBlue
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Încarcă evenimente când se schimbă data selectată
  useEffect(() => {
    loadEvents(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getJWT();
      if (token === null) {
        router.replace('/');
      }
    };
    checkAuth();
  }, []);

  const handleTimyPress = () => {
    router.push("/chat");
  };

  const handleProfilePress = () => {
    router.push("/profile");
  };

  const subtitleText = useMemo(()=>{
    const weekday=new Intl.DateTimeFormat("en-US",{weekday:"long"}).format(selectedDate);
    const month=new Intl.DateTimeFormat("en-US",{month:"long"}).format(selectedDate);
    const day=selectedDate.getDate(); const y=selectedDate.getFullYear();
    return `${weekday}, ${month} ${ordinal(day)} ${y}`;
  },[selectedDate]);

  return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircle}>
            <Image source={MenuIcon} style={styles.iconImageWhite} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={BellIcon} style={styles.iconImageWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconCircle,{marginLeft:12}]} onPress={handleProfilePress}>
              <Image source={UserIcon} style={styles.iconImageWhite} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: H*0.22 }} showsVerticalScrollIndicator={false}>
          {/* TITLE & DATE */}
          <View style={{ paddingHorizontal:16, paddingTop: 20 }}>
            <Text style={styles.title}>Let's See Your Day!</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>

          {/* CALENDAR */}
          <CalendarExpandable selectedDate={selectedDate} onSelect={setSelectedDate} />

          {/* CARDS - dinamic din backend */}
          {loading ? (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={{ color: C.muted }}>Loading events...</Text>
              </View>
          ) : events.length > 0 ? (
              events.map((event) => (
                  <EventCard key={event.id} event={event} onPress={() => setSelectedEvent(event)} />
              ))
          ) : (
              <View style={{ marginTop: 20, alignItems: "center", paddingHorizontal: 16 }}>
                <Text style={{ color: C.muted, fontSize: 16 }}>No events for this day</Text>
              </View>
          )}

        </ScrollView>

        {/* Chat Button - Fixed & Centered */}
        <TouchableOpacity
          onPress={handleTimyPress}
          activeOpacity={0.85}
          style={styles.chatButton}
        >
          <Image source={Timy} style={styles.timyImage} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>💬</Text>
          </View>
        </TouchableOpacity>
                {selectedEvent && (
            <EventDetailsSheet
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        )}
      </View>
  );
}

/** ============ EventCard ============ */
function EventCard({ event, onPress }: { event: CalendarEvent; onPress: () => void }) {
  // Calculează durata evenimentului
  const getDuration = () => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Formatează ora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const timeRange = `${formatTime(event.startTime)} to ${formatTime(event.endTime)} - ${getDuration()}`;

  // Culori pentru avatar-uri când nu există imagine
  const avatarColors = ["#DADADA", "#B3B3B3", "#7A7A7A", "#9CA3AF", "#6B7280"];

  return (
      <TouchableOpacity
          style={[styles.card, { backgroundColor: event.color || C.cardGrey }]}
          onPress={onPress}
          activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{event.title}</Text>
        <Row><Text style={styles.cardLine}>{timeRange}</Text></Row>
        {event.location && (
            <Row><Text style={styles.cardLine}>{event.location}</Text></Row>
        )}

        {/* Afișează participanții */}
        {event.attendees.length > 0 && (
            <>
              <Row>
                <Text style={styles.cardLine}>
                  {event.attendees.length === 1
                      ? event.attendees[0].name
                      : `${event.attendees.length} attendees`}
                </Text>
              </Row>

              {/* Avatar-uri pentru participanți */}
              <View style={{ flexDirection: "row", marginTop: 18 }}>
                {event.attendees.slice(0, 5).map((attendee, index) => (
                    <View
                        key={attendee.email}
                        style={[
                          styles.avatar,
                          {
                            marginLeft: index > 0 ? -10 : 0,
                            backgroundColor: avatarColors[index % avatarColors.length]
                          }
                        ]}
                    >
                      {attendee.avatarUrl ? (
                          <Image
                              source={{ uri: attendee.avatarUrl }}
                              style={{ width: 28, height: 28, borderRadius: 14 }}
                          />
                      ) : (
                          <Text style={{ color: C.white, fontSize: 11, fontWeight: "600" }}>
                            {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </Text>
                      )}
                    </View>
                ))}
                {event.attendees.length > 5 && (
                    <View
                        style={[
                          styles.avatar,
                          {
                            marginLeft: -10,
                            backgroundColor: "#64748B"
                          }
                        ]}
                    >
                      <Text style={{ color: C.white, fontSize: 10, fontWeight: "600" }}>
                        +{event.attendees.length - 5}
                      </Text>
                    </View>
                )}
              </View>
            </>
        )}
      </TouchableOpacity>
  );
}

function Row({children}:{children:React.ReactNode}){
  return (
      <View style={styles.row}>
        <View style={styles.bullet}/>
        <View style={{width:8}}/>
        <View style={{flex:1}}>{children}</View>
      </View>
  );
}

function EventDetailsSheet({
                             event,
                             onClose,
                           }: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  const H = Dimensions.get("window").height;
  const targetTop = H * 0.22;

  const sheetY = useRef(new Animated.Value(H)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    Animated.spring(sheetY, {
      toValue: targetTop,
      damping: 20,
      stiffness: 90,
      useNativeDriver: false,
    }).start();
  }, []);

  // FORMAT TIME
  const fmt = (ts: string) =>
      new Date(ts).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  const getDuration = () => {
    const s = new Date(event.startTime),
        e = new Date(event.endTime);
    const diff = e.getTime() - s.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // DRAG DOWN
  const panResponder = useMemo(
      () =>
          PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
              if (g.dy > 0) sheetY.setValue(targetTop + g.dy);
            },
            onPanResponderRelease: (_, g) => {
              if (g.dy > 100) {
                Animated.timing(sheetY, {
                  toValue: H,
                  duration: 200,
                  useNativeDriver: false,
                }).start(onClose);
              } else {
                Animated.spring(sheetY, {
                  toValue: targetTop,
                  damping: 15,
                  stiffness: 100,
                  useNativeDriver: false,
                }).start();
              }
            },
          }),
      [targetTop]
  );

  const avatarColors = ["#DADADA", "#B3B3B3", "#7A7A7A", "#9CA3AF", "#6B7280"];

  return (
      <>
        {/* BACKDROP */}
        <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={sheetStyles.backdropContainer}
        >
          <View style={sheetStyles.blurOverlay} />
        </TouchableOpacity>

        {/* SLIDING SHEET */}
        <Animated.View
            style={[sheetStyles.sheet, { top: sheetY }]}
        >
          <View {...panResponder.panHandlers} style={sheetStyles.handleArea}>
            <View style={sheetStyles.handle} />
          </View>

          <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={sheetStyles.scrollContent}
              bounces={true}
          >
            {/* HEADER WITH COLOR BAR */}
            <Text style={sheetStyles.title}>{event.title}</Text>

            {/* TIME CARD */}
            <View style={sheetStyles.infoCard}>
              <View style={sheetStyles.iconCircleSmall}>
                <Text style={sheetStyles.iconText}>🕐</Text>
              </View>
              <View style={sheetStyles.infoContent}>
                <Text style={sheetStyles.infoLabel}>Time</Text>
                <Text style={sheetStyles.infoValue}>
                  {fmt(event.startTime)} - {fmt(event.endTime)}
                </Text>
                <Text style={sheetStyles.infoDuration}>{getDuration()} duration</Text>
              </View>
            </View>

            {/* LOCATION CARD */}
            {event.location && (
                <View style={sheetStyles.infoCard}>
                  <View style={sheetStyles.iconCircleSmall}>
                    <Text style={sheetStyles.iconText}>📍</Text>
                  </View>
                  <View style={sheetStyles.infoContent}>
                    <Text style={sheetStyles.infoLabel}>Location</Text>
                    <Text style={sheetStyles.infoValue}>{event.location}</Text>
                  </View>
                </View>
            )}

            {/* ATTENDEES CARD */}
            <View style={sheetStyles.infoCard}>
              <View style={sheetStyles.iconCircleSmall}>
                <Text style={sheetStyles.iconText}>👥</Text>
              </View>
              <View style={sheetStyles.infoContent}>
                <Text style={sheetStyles.infoLabel}>
                  Attendees ({event.attendees.length})
                </Text>

                {/* Avatar Row */}
                <View style={sheetStyles.avatarRow}>
                  {event.attendees.slice(0, 5).map((a, i) => (
                      <View
                          key={a.email}
                          style={[
                            sheetStyles.avatarLarge,
                            {
                              marginLeft: i > 0 ? -12 : 0,
                              backgroundColor: avatarColors[i % avatarColors.length],
                              zIndex: 5 - i,
                            },
                          ]}
                      >
                        {a.avatarUrl ? (
                            <Image
                                source={{ uri: a.avatarUrl }}
                                style={sheetStyles.avatarImage}
                            />
                        ) : (
                            <Text style={sheetStyles.avatarInitials}>
                              {a.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                            </Text>
                        )}
                      </View>
                  ))}
                  {event.attendees.length > 5 && (
                      <View
                          style={[
                            sheetStyles.avatarLarge,
                            { marginLeft: -12, backgroundColor: "#64748B" },
                          ]}
                      >
                        <Text style={sheetStyles.avatarInitials}>
                          +{event.attendees.length - 5}
                        </Text>
                      </View>
                  )}
                </View>

                {/* Attendee List */}
                <View style={sheetStyles.attendeeList}>
                  {event.attendees.map((a, idx) => (
                      <View key={a.email} style={sheetStyles.attendeeItem}>
                        <View
                            style={[
                              sheetStyles.attendeeDot,
                              { backgroundColor: avatarColors[idx % avatarColors.length] },
                            ]}
                        />
                        <View>
                          <Text style={sheetStyles.attendeeName}>{a.name}</Text>
                          <Text style={sheetStyles.attendeeEmail}>{a.email}</Text>
                        </View>
                      </View>
                  ))}
                </View>
              </View>
            </View>

          </ScrollView>
        </Animated.View>
      </>
  );
}

const sheetStyles = StyleSheet.create({
  backdropContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  blurOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "85%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  handleArea: {
    paddingVertical: 12,
    alignItems: "center",
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  colorBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    width: "100%",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e1e6ecff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconText: {
    fontSize: 22,
  },

  infoContent: {
    flex: 1,
    justifyContent: "center",
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },

  infoDuration: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 2,
  },

  avatarRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  avatarLarge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  attendeeList: {
    marginTop: 8,
  },

  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  attendeeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },

  attendeeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },

  attendeeEmail: {
    fontSize: 13,
    color: "#94A3B8",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },

  actionButton: {
    flex: 1,
    backgroundColor: C.blue,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtonSecondary: {
    backgroundColor: "#F1F5F9",
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  actionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },
});
// /* ===================== styles ===================== */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:C.bg },
  header:{
    paddingTop:48,
    paddingHorizontal:12,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  headerRight:{ flexDirection:"row", alignItems:"center" },
  iconCircle:{
    width:40,
    height:40,
    borderRadius:22,
    backgroundColor: C.blue,
    alignItems:"center",
    justifyContent:"center"
  },
  iconImageWhite:{ width:21, height:21, resizeMode:"contain", tintColor:"#FFFFFF" },

  title:{ fontSize:32, lineHeight:36, fontWeight:"800", color:C.navy },
  subtitle:{ marginTop:8, fontSize:16, color:C.text },

  card:{ marginHorizontal:16, marginTop:16, borderRadius:18, padding:18 },
  cardTitle:{ fontSize:22, color:C.white, fontWeight:"700", marginBottom:8 },
  row:{ flexDirection:"row", alignItems:"center", marginTop:6 },
  bullet:{
    width:18,
    height:18,
    borderRadius:9,
    backgroundColor:C.white,
    opacity:0.9
  },
  cardLine:{ fontSize:15, color:C.white },
  avatar:{
    width:28,
    height:28,
    borderRadius:14,
    borderWidth:2,
    borderColor:"rgba(255,255,255,0.8)",
    alignItems:"center",
    justifyContent:"center"
  },

  chatButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4068A2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  timyImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4068A2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.bg,
  },
  badgeText: {
    fontSize: 12,
  }
});

/* ======= Calendar styles ======= */
const cal = StyleSheet.create({
  pillWrap:{ paddingHorizontal:16, marginTop:16, overflow:"hidden" },
  pillInner:{
    backgroundColor:C.pill,
    borderRadius:12,
    paddingVertical:16,
    paddingHorizontal:14,
    minHeight: 90
  },
  weekRow:{ paddingHorizontal:14 },
  weekInner:{ flexDirection:"row", justifyContent:"space-between" },
  dayCol:{ alignItems:"center", width:40 },
  dayLabel:{
    fontSize:13,
    color:C.muted,
    textTransform:"lowercase",
    marginBottom:10,
    fontWeight:"500"
  },
  dot:{
    width:40,
    height:40,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"transparent"
  },
  dotSel:{ backgroundColor:C.blue },
  dotText:{ fontSize:14, color:C.text, fontWeight:"500" },

  monthTitleRow:{
    paddingHorizontal:4,
    marginBottom:12,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  monthTitle:{
    fontSize:16,
    fontWeight:"600",
    color:C.navy,
    flex:1,
    textAlign:"center"
  },
  arrowButton:{
    width:32,
    height:32,
    alignItems:"center",
    justifyContent:"center"
  },
  arrowText:{
    fontSize:28,
    color:C.navy,
    fontWeight:"600"
  },
  monthHeaderRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:4,
    marginBottom:8
  },
  monthHeaderCell:{
    width:(Dimensions.get("window").width-56)/7,
    textAlign:"center",
    color:C.muted,
    fontSize:11,
    fontWeight:"600"
  },
  monthWeekRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:4,
    paddingHorizontal:4
  },
  monthCell:{
    width:(Dimensions.get("window").width-56)/7,
    alignItems:"center",
    paddingVertical:2
  },
  monthDot:{
    width:40,
    height:40,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"center"
  },
  monthDotBase:{ backgroundColor:"transparent" },
  monthDotText:{ fontSize:12, color:C.text },
});
